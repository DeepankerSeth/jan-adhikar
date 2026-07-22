'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const currentLanguage = () => document.documentElement.dataset.language || 'en';
const text = (en, hi) => currentLanguage() === 'hi' ? hi : en;
const scrollBehavior = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
let lastRouteButton = null;

const templates = {
  emergency: {
    en: `URGENT HELP NEEDED
Name: [name]
Exact location: [location]
Time: [time]
Need: [medical help / emergency response / legal help]
Safe callback: [number]

This message contains only the information I can presently confirm.`,
    hi: `तत्काल सहायता चाहिए
नाम: [नाम]
सटीक स्थान: [स्थान]
समय: [समय]
आवश्यकता: [चिकित्सा / आपात सहायता / कानूनी सहायता]
सुरक्षित संपर्क: [नंबर]

इस संदेश में केवल वही जानकारी है जिसकी मैं अभी पुष्टि कर सकता/सकती हूँ।`
  },
  custody: {
    en: `URGENT LEGAL HELP — KNOWN OR SUSPECTED POLICE CUSTODY
Name: [name]
Last confirmed time: [time]
Last confirmed location: [location]
Police station/unit/vehicle, if known: [details]
FIR/DD/arrest memo reference, if known: [reference]
Safe callback: [number]

Please help confirm custody and the next immediate legal step. I am also asking the likely police station or district control room for the BNSS section 37 designated officer and arrest information.

If the person is genuinely missing and there is no custody information, call Delhi Police missing-person helpline 1094 instead.`,
    hi: `तत्काल कानूनी सहायता — ज्ञात या संदिग्ध पुलिस हिरासत
नाम: [नाम]
अंतिम पुष्ट समय: [समय]
अंतिम पुष्ट स्थान: [स्थान]
पुलिस थाना/इकाई/वाहन, यदि ज्ञात: [विवरण]
FIR/DD/गिरफ्तारी मेमो संदर्भ, यदि ज्ञात: [संदर्भ]
सुरक्षित संपर्क: [नंबर]

कृपया हिरासत की पुष्टि और अगला तत्काल कानूनी कदम बताने में सहायता करें। मैं संभावित पुलिस थाना या जिला नियंत्रण कक्ष से BNSS धारा 37 के नामित अधिकारी और गिरफ्तारी की जानकारी भी माँग रहा/रही हूँ।

यदि व्यक्ति सच में लापता है और हिरासत की कोई जानकारी नहीं है, तो इसके बजाय दिल्ली पुलिस गुमशुदा व्यक्ति हेल्पलाइन 1094 पर कॉल करें।`
  },
  lawyer: {
    en: `I need urgent legal help for [name]. They were [injured / detained / reported missing] at [place] around [time]. The last confirmed information is [fact]. Please tell me the next immediate legal step. My safe callback number is [number].`,
    hi: `मुझे [नाम] के लिए तत्काल कानूनी सहायता चाहिए। वे [स्थान] पर लगभग [समय] [घायल / हिरासत / लापता] हुए। अंतिम पुष्ट जानकारी [तथ्य] है। कृपया अगला तत्काल कानूनी कदम बताएं। मेरा सुरक्षित संपर्क नंबर [नंबर] है।`
  }
};

const roleLabels = {
  affected: ['Directly affected', 'सीधे प्रभावित'],
  family: ['Family member or authorized helper', 'परिवार सदस्य या अधिकृत सहायक'],
  witness: ['Eyewitness', 'प्रत्यक्षदर्शी'],
  reports: ['Using identified reports, not personal knowledge', 'पहचानी गई रिपोर्टों के आधार पर, व्यक्तिगत जानकारी नहीं']
};

const needLabels = {
  medical: ['Medical help', 'चिकित्सा सहायता'],
  legal: ['Lawyer', 'वकील'],
  custody: ['Custody confirmation', 'हिरासत की पुष्टि'],
  missing: ['Locate a missing person', 'लापता व्यक्ति का पता'],
  preserve: ['Preserve evidence', 'साक्ष्य संरक्षण'],
  none: ['No immediate need stated', 'कोई तत्काल आवश्यकता नहीं बताई गई']
};

const CITIES = ['delhi', 'mumbai', 'other'];

function currentCity() {
  const stored = localStorage.getItem('jan-adhikar-city');
  return CITIES.includes(stored) ? stored : 'other';
}

function applyCity(city) {
  $$('[data-city-scope]').forEach(element => {
    element.hidden = !element.dataset.cityScope.split(' ').includes(city);
  });
  $$('.city-chip').forEach(chip => chip.setAttribute('aria-pressed', String(chip.dataset.city === city)));
}

function selectCity(city) {
  localStorage.setItem('jan-adhikar-city', city);
  applyCity(city);
}

function translatePage() {
  $$('[data-en][data-hi]').forEach(element => {
    element.textContent = currentLanguage() === 'hi' ? element.dataset.hi : element.dataset.en;
  });
  document.documentElement.lang = currentLanguage() === 'hi' ? 'hi' : 'en';
  $('#languageToggle').textContent = currentLanguage() === 'hi' ? 'English' : 'हिन्दी';
  $('#languageToggle').setAttribute('aria-label', text('Switch to Hindi', 'अंग्रेज़ी में बदलें'));
  $('#headerEmergency').setAttribute('aria-label', text('Call emergency number 112', 'आपात नंबर 112 पर कॉल करें'));
  updateNetworkStatus();
}

function switchLanguage() {
  document.documentElement.dataset.language = currentLanguage() === 'en' ? 'hi' : 'en';
  localStorage.setItem('jan-adhikar-language', currentLanguage());
  translatePage();
}

function openRoute(name, trigger) {
  lastRouteButton = trigger || $(`[data-route="${name}"]`);
  $$('.help-panel').forEach(panel => { panel.hidden = true; });
  $$('.route').forEach(button => button.setAttribute('aria-expanded', 'false'));
  const panel = $(`#panel-${name}`);
  if (!panel) return;
  lastRouteButton?.setAttribute('aria-expanded', 'true');
  panel.hidden = false;
  panel.focus({ preventScroll: true });
  panel.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
}

function closePanels() {
  $$('.help-panel').forEach(panel => { panel.hidden = true; });
  $$('.route').forEach(button => button.setAttribute('aria-expanded', 'false'));
  const target = lastRouteButton || $('.routes');
  target.focus?.({ preventScroll: true });
  target.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
}

async function copyText(value, message) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (_) {
    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  showToast(message || text('Copied.', 'कॉपी हो गया।'));
}

function copyTemplate(key) {
  const template = templates[key]?.[currentLanguage()];
  if (template) copyText(template, text('Message copied. Fill every bracket before sending.', 'संदेश कॉपी हो गया। भेजने से पहले हर कोष्ठक भरें।'));
}

function incidentNote(data) {
  const role = roleLabels[data.get('role')]?.[currentLanguage() === 'hi' ? 1 : 0] || '';
  const need = needLabels[data.get('need')]?.[currentLanguage() === 'hi' ? 1 : 0] || '';
  const created = new Date().toLocaleString(currentLanguage() === 'hi' ? 'hi-IN' : 'en-IN');

  if (currentLanguage() === 'hi') {
    return `ADHIKAR SATHI — घटना नोट
================================
बनाया गया: ${created}

तत्काल आवश्यकता: ${need}
प्रभावित व्यक्ति: ${data.get('affected')}
जानकारी देने वाले का संबंध: ${role}
घटना की तारीख/समय: ${data.get('when')}
सटीक स्थान: ${data.get('where')}

क्या हुआ
--------
${data.get('facts')}

उपलब्ध साक्ष्य
---------------
${data.get('evidence') || 'कोई सूचीबद्ध नहीं'}

साक्ष्य की निगरानी (फ़ोटो/वीडियो हो तो भरें)
---------------
रिकॉर्ड किसने किया: [नाम]
उपकरण: [फ़ोन मॉडल]
मूल फ़ाइल कहाँ रखी है: [स्थान]
प्रतियाँ किसे दीं: [किसे, कब]
मूल फ़ाइल बिना बदले रखें; केवल प्रतियाँ साझा करें।

सुरक्षित संपर्क
---------------
${data.get('contact') || 'नहीं दिया गया'}

जाँच घोषणा
-----------
मैंने स्वयं ज्ञात तथ्यों और दूसरों से मिली जानकारी को अलग रखने का प्रयास किया है। साझा करने से पहले मैं इस नोट की जाँच करूँगा/करूँगी और ऐसी बात हटाऊँगा/हटाऊँगी जिसका मैं समर्थन नहीं कर सकता/सकती।

यह नोट अदालत में दाखिला, शिकायत नंबर या सहायता भेजे जाने की गारंटी नहीं है। तत्काल खतरे में 112 और कानूनी सहायता 15100 पर कॉल करें।`;
  }

  return `ADHIKAR SATHI — INCIDENT NOTE
============================
Created: ${created}

Urgent need: ${need}
Affected person: ${data.get('affected')}
Source/relationship: ${role}
Incident date/time: ${data.get('when')}
Exact location: ${data.get('where')}

What happened
-------------
${data.get('facts')}

Evidence available
------------------
${data.get('evidence') || 'None listed'}

Evidence custody (fill if you have photos/videos)
------------------
Recorded by: [name]
Device: [phone model]
Original file kept at: [where]
Copies given to: [who, when]
Keep the original file unchanged; share copies only.

Safe contact
------------
${data.get('contact') || 'Not provided'}

Review declaration
------------------
I have tried to distinguish facts personally known to me from information received from others. Before sharing, I will review this note and remove anything I cannot support.

This note does not file a court case, create a complaint number or guarantee that help is dispatched. In immediate danger call 112; for legal aid call 15100.`;
}

function generateIncident(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  $('#incidentText').value = incidentNote(new FormData(form));
  $('#incidentOutput').hidden = false;
  $$('#incidentForm [aria-invalid="true"]').forEach(field => field.removeAttribute('aria-invalid'));
  $('#incidentOutput').scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' });
  $('.success-message').focus({ preventScroll: true });
}

function downloadIncident() {
  const content = $('#incidentText').value;
  if (!content) return;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `adhikar-sathi-incident-${new Date().toISOString().slice(0, 10)}.txt`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(text('Incident note downloaded to this device.', 'घटना नोट इस उपकरण पर डाउनलोड हो गया।'));
}

async function shareSite() {
  const shareData = {
    title: 'Adhikar Sathi',
    text: text('Fast protest safety, detention and legal-aid help.', 'प्रदर्शन के दौरान तेज़ सुरक्षा, हिरासत और कानूनी सहायता।'),
    url: location.href.split('#')[0]
  };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (_) { return; }
  } else {
    await copyText(shareData.url, text('Link copied.', 'लिंक कॉपी हो गया।'));
  }
}

function updateNetworkStatus() {
  const status = $('#networkStatus');
  const banner = $('#offlineBanner');
  const online = navigator.onLine;
  status.textContent = online ? text('Online', 'ऑनलाइन') : text('Offline copy', 'ऑफ़लाइन प्रति');
  status.classList.toggle('offline', !online);
  banner.hidden = online;
}

function handleInvalid(event) {
  event.target.setAttribute('aria-invalid', 'true');
  showToast(text('Complete the highlighted required field.', 'चिन्हित आवश्यक फ़ील्ड पूरा करें।'));
}

function clearInvalid(event) {
  event.target.removeAttribute?.('aria-invalid');
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 3200);
}

function init() {
  document.documentElement.dataset.language = localStorage.getItem('jan-adhikar-language') || 'en';
  translatePage();
  applyCity(currentCity());
  $$('.city-chip').forEach(chip => chip.addEventListener('click', () => selectCity(chip.dataset.city)));
  $$('.route').forEach(button => button.addEventListener('click', () => openRoute(button.dataset.route, button)));
  $$('[data-close-panel]').forEach(button => button.addEventListener('click', closePanels));
  $$('[data-copy]').forEach(button => button.addEventListener('click', () => copyTemplate(button.dataset.copy)));
  $('#languageToggle').addEventListener('click', switchLanguage);
  $('#incidentForm').addEventListener('submit', generateIncident);
  $('#incidentForm').addEventListener('invalid', handleInvalid, true);
  $('#incidentForm').addEventListener('input', clearInvalid);
  $('#copyIncident').addEventListener('click', () => copyText($('#incidentText').value, text('Incident note copied. Review it before sharing.', 'घटना नोट कॉपी हो गया। साझा करने से पहले जाँचें।')));
  $('#downloadIncident').addEventListener('click', downloadIncident);
  $('#printCard').addEventListener('click', () => window.print());
  $('#shareButton')?.addEventListener('click', shareSite);
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && $$('.help-panel').some(panel => !panel.hidden)) closePanels();
  });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
