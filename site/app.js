'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const lang = () => document.documentElement.dataset.language || 'en';
const t = (en, hi) => (lang() === 'hi' ? hi : en);

const official = {
  nhrc: {
    email: 'complaint.nhrc@nic.in',
    portal: 'https://www.hrcnet.nic.in/HRCNet/public/webcomplaint.aspx',
    label: 'NHRC online complaint portal'
  },
  police: {
    email: 'splcp.vig@delhipolice.gov.in',
    cc: 'cpdelhi@delhipolice.gov.in',
    portal: 'https://cctns.delhipolice.gov.in/citizen/',
    label: 'Delhi Police citizen portal'
  },
  supreme: {
    email: 'supremecourt@nic.in',
    portal: 'https://efiling3.sci.gov.in/',
    label: 'Supreme Court e-Filing'
  },
  legalaid: {
    email: 'sclsc@nic.in',
    cc: 'lae-dslsa@gov.in',
    portal: 'https://sclsc.gov.in/',
    label: 'Supreme Court Legal Services Committee'
  },
  neet: {
    email: 'neetug2026@nta.ac.in',
    portal: 'https://pgportal.gov.in/',
    label: 'CPGRAMS grievance portal'
  },
  rti: {
    email: '',
    portal: 'https://rtionline.gov.in/',
    label: 'RTI Online portal'
  },
  witness: {
    email: '',
    portal: 'https://dslsa.org/',
    label: 'Delhi State Legal Services Authority'
  },
  custody: {
    email: 'cpdelhi@delhipolice.gov.in',
    cc: 'lae-dslsa@gov.in',
    portal: 'https://cctns.delhipolice.gov.in/citizen/',
    label: 'Delhi Police citizen portal'
  }
};

const roleOptions = [
  ['', 'Select', 'चुनें'],
  ['directly affected person', 'Directly affected person', 'सीधे प्रभावित व्यक्ति'],
  ['family member or authorized representative', 'Family member or authorized representative', 'परिवार सदस्य या अधिकृत प्रतिनिधि'],
  ['eyewitness', 'Eyewitness', 'प्रत्यक्षदर्शी'],
  ['lawyer or legal volunteer', 'Lawyer or legal volunteer', 'वकील या कानूनी स्वयंसेवक'],
  ['doctor or medical volunteer', 'Doctor or medical volunteer', 'डॉक्टर या चिकित्सा स्वयंसेवक'],
  ['journalist', 'Journalist', 'पत्रकार'],
  ['concerned citizen relying on identified public reports', 'Concerned citizen relying on identified public reports', 'पहचानी गई सार्वजनिक रिपोर्टों पर निर्भर चिंतित नागरिक']
];

const fields = {
  name: { label: ['Full legal name', 'पूरा कानूनी नाम'], type: 'text', required: true, autocomplete: 'name' },
  address: { label: ['Complete postal address', 'पूरा डाक पता'], type: 'textarea', required: true, full: true },
  email: { label: ['Email address', 'ईमेल पता'], type: 'email', required: true, autocomplete: 'email' },
  phone: { label: ['Telephone number', 'टेलीफोन नंबर'], type: 'tel', required: true, autocomplete: 'tel' },
  role: { label: ['Your connection to the matter', 'मामले से आपका संबंध'], type: 'select', required: true, options: roleOptions },
  idref: { label: ['Masked identification reference (optional)', 'आंशिक पहचान संदर्भ (वैकल्पिक)'], type: 'text', help: ['Do not enter Aadhaar, PAN, or any full identity number. Use only masked last four digits if a specific authority requires a reference.', 'आधार, PAN या कोई पूरा पहचान नंबर न भरें। किसी प्राधिकरण को संदर्भ आवश्यक हो तो केवल छिपे हुए अंतिम चार अंक दें।'] },
  pilBasis: { label: ["Why does this fit the Supreme Court's letter-PIL guidelines?", 'यह मामला सुप्रीम कोर्ट के पत्र-PIL दिशानिर्देशों में क्यों आता है?'], type: 'textarea', required: true, full: true, rows: 4, help: ['Identify the relevant category, such as serious police harassment, custody abuse, a riot-victim matter, or another matter of public importance. An educational-admission grievance alone is ordinarily excluded.', 'संबंधित श्रेणी बताएं, जैसे गंभीर पुलिस उत्पीड़न, हिरासत दुरुपयोग, दंगा-पीड़ित मामला या अन्य जनमहत्व का विषय। केवल शैक्षणिक प्रवेश की शिकायत सामान्यतः बाहर रखी जाती है।'] },
  pilClass: { label: ['Who is the affected group, and why is this a matter of public importance?', 'प्रभावित समूह कौन है और यह जनमहत्व का विषय क्यों है?'], type: 'textarea', required: true, full: true, rows: 4 },
  pendingCase: { label: ['Is a court case about the same events already pending?', 'क्या उन्हीं घटनाओं पर कोई मामला अदालत में पहले से लंबित है?'], type: 'select', required: true, full: true, options: [['', 'Select', 'चुनें'], ['no', 'No known pending case', 'कोई ज्ञात लंबित मामला नहीं'], ['yes', 'Yes', 'हाँ'], ['unsure', 'Unsure', 'निश्चित नहीं']], help: ['If yes or unsure, do not ask for informal “tagging.” Seek an Advocate-on-Record or permitted party-in-person route for a formal filing in the case.', 'यदि हाँ या निश्चित नहीं, तो अनौपचारिक “टैगिंग” न मांगें। मामले में औपचारिक दाखिले के लिए एडवोकेट-ऑन-रिकॉर्ड या अनुमत पार्टी-इन-पर्सन मार्ग लें।'] },
  date: { label: ['Incident date', 'घटना की तारीख'], type: 'date', required: true },
  time: { label: ['Approximate time', 'अनुमानित समय'], type: 'time' },
  location: { label: ['Exact location', 'सटीक स्थान'], type: 'text', required: true, full: true },
  facts: { label: ['What happened? Separate what you personally know from identified reports.', 'क्या हुआ? स्वयं ज्ञात तथ्यों और पहचानी गई रिपोर्टों को अलग लिखें।'], type: 'textarea', required: true, full: true, rows: 7, help: ['Describe events in chronological order. Identify the source of anything you did not personally witness.', 'घटनाओं को समयक्रम में लिखें। जिसे आपने स्वयं नहीं देखा, उसका स्रोत बताएं।'] },
  evidence: { label: ['Evidence available', 'उपलब्ध साक्ष्य'], type: 'textarea', full: true, rows: 4, help: ['List original videos, photographs, medical records, arrest documents, witnesses or official orders. Do not paste sensitive files here.', 'मूल वीडियो, तस्वीरें, मेडिकल रिकॉर्ड, गिरफ्तारी दस्तावेज़, गवाह या आधिकारिक आदेश सूचीबद्ध करें। संवेदनशील फ़ाइलें यहाँ न चिपकाएँ।'] },
  prior: { label: ['Prior complaints or legal proceedings', 'पहले की शिकायतें या कानूनी कार्यवाही'], type: 'textarea', full: true, rows: 4, help: ['Include authority, date, diary/FIR/case number and response, if any.', 'प्राधिकरण, तारीख, डायरी/FIR/मामला संख्या और उत्तर, यदि कोई हो, शामिल करें।'] },
  relief: { label: ['What action are you requesting?', 'आप कौन-सी कार्रवाई चाहते हैं?'], type: 'textarea', required: true, full: true, rows: 4 },
  affected: { label: ['Name of affected person', 'प्रभावित व्यक्ति का नाम'], type: 'text', required: true },
  relation: { label: ['Your relationship to that person', 'उस व्यक्ति से आपका संबंध'], type: 'text', required: true },
  policeUnit: { label: ['Police station, unit, officer or vehicle details (if known)', 'पुलिस थाना, इकाई, अधिकारी या वाहन विवरण (यदि ज्ञात हो)'], type: 'text', full: true },
  policeDestination: { label: ['Which route fits the complaint?', 'शिकायत के लिए कौन-सा मार्ग सही है?'], type: 'select', required: true, full: true, options: [['', 'Select', 'चुनें'], ['crime', 'Immediate danger or cognizable offence — 112/local police', 'तत्काल खतरा या संज्ञेय अपराध — 112/स्थानीय पुलिस'], ['vigilance', 'Corruption, negligence or malpractice — Delhi Police Vigilance', 'भ्रष्टाचार, लापरवाही या कदाचार — दिल्ली पुलिस सतर्कता'], ['pca', 'Defined serious misconduct — Police Complaints Authority', 'परिभाषित गंभीर दुराचार — पुलिस शिकायत प्राधिकरण']], help: ['PCA covers defined serious allegations such as custodial death, grievous hurt, rape or attempted rape, arrest or detention without due process, extortion, land/house grabbing, or serious abuse of authority.', 'PCA हिरासत में मृत्यु, गंभीर चोट, बलात्कार/प्रयास, विधिसम्मत प्रक्रिया के बिना गिरफ्तारी/हिरासत, जबरन वसूली, भूमि/घर कब्जा या अधिकार के गंभीर दुरुपयोग जैसे परिभाषित आरोप देखता है।'] },
  respondentAuthority: { label: ['Public servant or authority complained against', 'जिस लोक सेवक या प्राधिकरण के विरुद्ध शिकायत है'], type: 'textarea', required: true, full: true, rows: 3, help: ['Give the name, designation, unit and address if known. Do not guess.', 'नाम, पद, इकाई और पता ज्ञात हो तो दें। अनुमान न लगाएं।'] },
  sameForum: { label: ['Is the same matter before a court or State Human Rights Commission?', 'क्या यही मामला किसी अदालत या राज्य मानवाधिकार आयोग के सामने है?'], type: 'select', required: true, full: true, options: [['', 'Select', 'चुनें'], ['no', 'No', 'नहीं'], ['court', 'Yes — court', 'हाँ — अदालत'], ['shrc', 'Yes — State Human Rights Commission', 'हाँ — राज्य मानवाधिकार आयोग'], ['unsure', 'Unsure', 'निश्चित नहीं']] },
  custody: { label: ['Last known custody/location details', 'अंतिम ज्ञात हिरासत/स्थान विवरण'], type: 'textarea', required: true, full: true, rows: 4 },
  medical: { label: ['Injuries, treatment and medical records', 'चोट, उपचार और मेडिकल रिकॉर्ड'], type: 'textarea', full: true, rows: 4 },
  application: { label: ['NEET application number', 'NEET आवेदन संख्या'], type: 'text', required: true },
  examCity: { label: ['Examination city/centre', 'परीक्षा शहर/केंद्र'], type: 'text', required: true },
  candidateImpact: { label: ['Specific academic, financial or personal impact', 'विशिष्ट शैक्षणिक, वित्तीय या व्यक्तिगत प्रभाव'], type: 'textarea', required: true, full: true, rows: 5 },
  neetRoute: { label: ['What type of NEET matter is this?', 'यह किस प्रकार का NEET मामला है?'], type: 'select', required: true, full: true, options: [['', 'Select', 'चुनें'], ['nta', 'NTA examination processing, result or helpdesk', 'NTA परीक्षा प्रक्रिया, परिणाम या हेल्पडेस्क'], ['answer', 'Answer key, OMR or recorded response', 'उत्तर कुंजी, OMR या दर्ज उत्तर'], ['mcc', 'All-India counselling or admission', 'अखिल भारतीय काउंसलिंग या प्रवेश'], ['state', 'State quota, category, domicile or admission', 'राज्य कोटा, श्रेणी, डोमिसाइल या प्रवेश']] },
  neetAuthority: { label: ['Responsible authority', 'जिम्मेदार प्राधिकरण'], type: 'text', required: true, full: true, help: ['Enter NTA, MCC, or the exact state counselling/admitting authority. Do not send a state or counselling issue to NTA.', 'NTA, MCC या सटीक राज्य काउंसलिंग/प्रवेश प्राधिकरण लिखें। राज्य या काउंसलिंग का मामला NTA को न भेजें।'] },
  authority: { label: ['Central public authority holding the records', 'रिकॉर्ड रखने वाला केंद्रीय सार्वजनिक प्राधिकरण'], type: 'text', required: true, full: true },
  records: { label: ['Precisely identify the existing records requested', 'मांगे गए मौजूदा रिकॉर्ड स्पष्ट रूप से बताएं'], type: 'textarea', required: true, full: true, rows: 7, help: ['You may request an existing opinion, advice, note or legal-vetting record. Do not ask the CPIO to create a fresh explanation, inference or opinion.', 'आप मौजूदा राय, सलाह, नोट या कानूनी जाँच रिकॉर्ड मांग सकते हैं। CPIO से नई व्याख्या, निष्कर्ष या राय बनाने को न कहें।'] },
  rtiUrgency: { label: ['Response period claimed', 'मांगी गई उत्तर अवधि'], type: 'select', required: true, full: true, options: [['', 'Select', 'चुनें'], ['ordinary', 'Ordinary request — normally 30 days', 'सामान्य अनुरोध — आम तौर पर 30 दिन'], ['life', 'Life or liberty — 48 hours, with a clear nexus', 'जीवन या स्वतंत्रता — 48 घंटे, स्पष्ट संबंध सहित']], help: ['Use 48 hours only where the requested records have a direct and credible connection to an identified person’s life or liberty. Explain that connection in the request.', '48 घंटे केवल तभी चुनें जब मांगे गए रिकॉर्ड का किसी पहचाने गए व्यक्ति के जीवन या स्वतंत्रता से सीधा और विश्वसनीय संबंध हो। अनुरोध में वह संबंध स्पष्ट करें।'] },
  rtiFormat: { label: ['Preferred form of access', 'सूचना पाने का पसंदीदा रूप'], type: 'select', required: true, full: true, options: [['', 'Select', 'चुनें'], ['electronic copies', 'Electronic copies', 'इलेक्ट्रॉनिक प्रतियां'], ['certified copies', 'Certified copies', 'प्रमाणित प्रतियां'], ['inspection followed by selected copies', 'Inspection, then selected copies', 'निरीक्षण, फिर चुनी गई प्रतियां']] },
  citizenship: { label: ['I confirm I am an Indian citizen', 'मैं पुष्टि करता/करती हूँ कि मैं भारतीय नागरिक हूँ'], type: 'checkbox', required: true, full: true },
  witnessPosition: { label: ['Where were you positioned and what could you see/hear?', 'आप कहाँ थे और क्या देख/सुन सकते थे?'], type: 'textarea', required: true, full: true, rows: 4 },
  sourceDistinction: { label: ['Facts learned from others or public reports', 'दूसरों या सार्वजनिक रिपोर्टों से मिले तथ्य'], type: 'textarea', full: true, rows: 4 },
  aidDestination: { label: ['Which legal-aid authority should receive this?', 'यह अनुरोध किस कानूनी सहायता प्राधिकरण को भेजना है?'], type: 'select', required: true, full: true, options: [['', 'Select', 'चुनें'], ['dslsa', 'DSLSA — urgent Delhi matter', 'DSLSA — तत्काल दिल्ली मामला'], ['sclsc', 'SCLSC — eligible non-PIL Supreme Court matter', 'SCLSC — पात्र गैर-PIL सुप्रीम कोर्ट मामला']] },
  consent: { label: ['I confirm this draft is truthful to the best of my knowledge and I will review it before sending.', 'मैं पुष्टि करता/करती हूँ कि यह मसौदा मेरी जानकारी के अनुसार सत्य है और भेजने से पहले इसकी समीक्षा करूंगा/करूंगी।'], type: 'checkbox', required: true, full: true }
};

const actions = {
  nhrc: {
    title: ['Human-rights complaint to the NHRC', 'NHRC को मानवाधिकार शिकायत'],
    intro: ['A victim or a person acting on the victim’s behalf may complain. Another concerned person may provide specific information and request possible suo motu consideration. Preserve the acknowledgment and diary number.', 'पीड़ित या पीड़ित की ओर से कार्य करने वाला व्यक्ति शिकायत कर सकता है। अन्य चिंतित व्यक्ति विशिष्ट जानकारी देकर स्वतः संज्ञान पर विचार का अनुरोध कर सकता है। प्राप्ति और डायरी नंबर सुरक्षित रखें।'],
    alert: ['The NHRC ordinarily does not entertain incidents more than one year old, sub judice matters, vague or anonymous complaints, frivolous complaints, or service matters. File promptly.', 'NHRC सामान्यतः एक वर्ष से अधिक पुरानी घटनाओं, न्यायालय में लंबित मामलों, अस्पष्ट या गुमनाम शिकायतों, तुच्छ शिकायतों या सेवा मामलों पर विचार नहीं करता। शीघ्र दाखिल करें।'],
    fields: ['name','address','email','phone','role','respondentAuthority','sameForum','date','time','location','affected','facts','medical','evidence','prior','relief','consent'],
    subject: 'Complaint concerning alleged human-rights violations by public authorities'
  },
  police: {
    title: ['Police complaint routing and draft', 'पुलिस शिकायत का मार्ग और मसौदा'],
    intro: ['Choose the route before drafting: 112/local police for immediate danger or a cognizable offence; Vigilance for corruption, negligence or malpractice; or the external Police Complaints Authority for its defined serious-misconduct categories.', 'मसौदा बनाने से पहले मार्ग चुनें: तत्काल खतरे या संज्ञेय अपराध के लिए 112/स्थानीय पुलिस; भ्रष्टाचार, लापरवाही या कदाचार के लिए सतर्कता; या परिभाषित गंभीर दुराचार के लिए बाहरी पुलिस शिकायत प्राधिकरण।'],
    alert: ['Vigilance is an internal Delhi Police channel. The Police Complaints Authority is a separate oversight body for defined serious misconduct. NHRC may be an additional route for public-servant human-rights violations.', 'सतर्कता दिल्ली पुलिस का आंतरिक माध्यम है। पुलिस शिकायत प्राधिकरण परिभाषित गंभीर दुराचार के लिए अलग निगरानी निकाय है। लोक सेवक द्वारा मानवाधिकार उल्लंघन में NHRC एक अतिरिक्त मार्ग हो सकता है।'],
    fields: ['policeDestination','name','address','email','phone','role','date','time','location','policeUnit','affected','facts','medical','evidence','prior','relief','consent'],
    subject: 'Complaint and preservation request concerning alleged police misconduct'
  },
  supreme: {
    title: ['Letter to the Chief Justice requesting PIL screening — not a filing', 'मुख्य न्यायाधीश को PIL जांच का अनुरोध — दाखिला नहीं'],
    intro: ['This prepares a letter addressed to the Chief Justice of India. The Court’s general email is not a designated PIL-filing channel. The letter may be screened, returned, redirected, or receive no judicial action.', 'यह भारत के मुख्य न्यायाधीश को संबोधित पत्र तैयार करता है। अदालत का सामान्य ईमेल PIL दाखिले का निर्दिष्ट माध्यम नहीं है। पत्र की जांच हो सकती है, लौटाया या अन्यत्र भेजा जा सकता है, या कोई न्यायिक कार्रवाई न हो सकती है।'],
    alert: ['Screening is narrow, and SCLSC says it does not grant legal aid to file PILs. If the same issue is already in court, use the formal case procedure through an Advocate-on-Record or a permitted party-in-person—not an email request for “tagging.”', 'जांच सीमित है और SCLSC के अनुसार PIL दाखिल करने के लिए कानूनी सहायता नहीं मिलती। यदि वही विषय अदालत में है, तो एडवोकेट-ऑन-रिकॉर्ड या अनुमत पार्टी-इन-पर्सन के माध्यम से औपचारिक प्रक्रिया लें—ईमेल से “टैगिंग” न मांगें।'],
    fields: ['name','address','email','phone','role','idref','pilBasis','pilClass','pendingCase','date','time','location','affected','facts','medical','evidence','prior','relief','consent'],
    subject: 'Letter to the Chief Justice of India requesting PIL screening — not a court filing'
  },
  legalaid: {
    title: ['Request for urgent legal assistance', 'तत्काल कानूनी सहायता अनुरोध'],
    intro: ['Send this to SCLSC for a Supreme Court matter or DSLSA for a Delhi matter. Explain the urgency, your connection to the case and the help needed.', 'सुप्रीम कोर्ट मामले के लिए SCLSC या दिल्ली मामले के लिए DSLSA को भेजें। तात्कालिकता, मामले से संबंध और आवश्यक सहायता स्पष्ट करें।'],
    alert: ['Legal-aid eligibility and representation are decided by the relevant authority. For immediate detention or danger, call the helplines as well as sending the request.', 'कानूनी सहायता की पात्रता और प्रतिनिधित्व संबंधित प्राधिकरण तय करता है। तत्काल हिरासत या खतरे में ईमेल के साथ हेल्पलाइन पर भी कॉल करें।'],
    fields: ['aidDestination','name','address','email','phone','role','date','time','location','affected','relation','facts','custody','medical','evidence','prior','relief','consent'],
    subject: 'Urgent request for legal assistance concerning detention or rights violation'
  },
  neet: {
    title: ['Individual NEET grievance', 'व्यक्तिगत NEET शिकायत'],
    intro: ['Use this for your own candidate-specific grievance. Send the supporting documents requested by NTA and use CPGRAMS for a trackable grievance to the responsible central department when appropriate.', 'अपनी उम्मीदवार-विशिष्ट शिकायत के लिए इसका उपयोग करें। NTA द्वारा मांगे गए सहायक दस्तावेज़ भेजें और उपयुक्त होने पर जिम्मेदार केंद्रीय विभाग को ट्रैक करने योग्य शिकायत हेतु CPGRAMS का उपयोग करें।'],
    alert: ['As of 22 July 2026: the answer-key challenge ran 25–28 June; OMR/recorded-response access ran 13–15 July; the final answer key and result were published 16 July. Email or CPGRAMS does not reopen a deadline. NTA does not handle counselling or admission.', '22 जुलाई 2026 की स्थिति: उत्तर-कुंजी चुनौती 25–28 जून; OMR/दर्ज उत्तर 13–15 जुलाई; अंतिम उत्तर कुंजी और परिणाम 16 जुलाई को प्रकाशित हुए। ईमेल या CPGRAMS समयसीमा दोबारा नहीं खोलता। NTA काउंसलिंग या प्रवेश नहीं संभालता।'],
    fields: ['neetRoute','neetAuthority','name','address','email','phone','application','examCity','facts','candidateImpact','evidence','prior','relief','consent'],
    subject: 'NEET (UG) 2026 candidate grievance and request for written resolution'
  },
  rti: {
    title: ['Right to Information request', 'सूचना का अधिकार आवेदन'],
    intro: ['Use the central RTI Online portal only for central public authorities, and only if the applicant is an Indian citizen. Do not use it for a state government or GNCTD: the portal warns those applications will be returned without refund.', 'केंद्रीय RTI ऑनलाइन पोर्टल केवल केंद्रीय सार्वजनिक प्राधिकरण और भारतीय नागरिक आवेदक के लिए है। राज्य सरकार या GNCTD के लिए इसका उपयोग न करें: पोर्टल के अनुसार आवेदन बिना शुल्क-वापसी के लौटाया जाएगा।'],
    alert: ['Request identifiable existing records, including an existing opinion or advice if needed. Do not ask the CPIO to create a fresh explanation. Ordinary requests are normally answered within 30 days; a genuine life-or-liberty request is 48 hours.', 'पहचान योग्य मौजूदा रिकॉर्ड मांगें; आवश्यक हो तो मौजूदा राय या सलाह भी। CPIO से नई व्याख्या बनाने को न कहें। सामान्य उत्तर आम तौर पर 30 दिन में; वास्तविक जीवन या स्वतंत्रता अनुरोध 48 घंटे में होता है।'],
    fields: ['name','address','email','phone','citizenship','authority','rtiUrgency','rtiFormat','records','consent'],
    subject: 'Application under the Right to Information Act, 2005'
  },
  witness: {
    title: ['Factual witness statement', 'तथ्यात्मक प्रत्यक्षदर्शी बयान'],
    intro: ['Create a dated factual record for a lawyer, court or investigating authority. Describe only what you directly perceived and identify information learned from other people separately.', 'वकील, अदालत या जांच प्राधिकरण के लिए दिनांकित तथ्यात्मक रिकॉर्ड तैयार करें। केवल वही लिखें जो आपने सीधे देखा या सुना और दूसरों से मिली जानकारी अलग पहचानें।'],
    alert: ['Keep the signed original private. Do not publish identifying details of vulnerable people without consent.', 'हस्ताक्षरित मूल प्रति निजी रखें। संवेदनशील लोगों की पहचान संबंधी जानकारी बिना सहमति सार्वजनिक न करें।'],
    fields: ['name','address','email','phone','date','time','location','witnessPosition','facts','sourceDistinction','evidence','consent'],
    subject: 'Factual witness statement'
  },
  custody: {
    title: ['Urgent inquiry concerning custody or whereabouts', 'हिरासत या ठिकाने संबंधी तत्काल अनुरोध'],
    intro: ['Use this to request confirmation of a person’s custody, police station, legal basis, medical condition and access to counsel. Call emergency and legal-aid numbers at the same time.', 'किसी व्यक्ति की हिरासत, पुलिस थाना, कानूनी आधार, चिकित्सा स्थिति और वकील तक पहुँच की पुष्टि मांगने के लिए इसका उपयोग करें। साथ ही आपातकाल और कानूनी सहायता नंबरों पर कॉल करें।'],
    alert: ['This is not a substitute for habeas corpus or urgent legal intervention. A lawyer should assess immediate court action.', 'यह बंदी प्रत्यक्षीकरण या तत्काल कानूनी हस्तक्षेप का विकल्प नहीं है। वकील को तत्काल अदालती कार्रवाई का आकलन करना चाहिए।'],
    fields: ['name','address','email','phone','affected','relation','date','time','location','custody','facts','medical','evidence','prior','relief','consent'],
    subject: 'Urgent request to confirm custody, whereabouts and legal access'
  }
};

let activeAction = 'nhrc';

function renderField(key) {
  const f = fields[key];
  const id = `field-${key}`;
  const required = f.required ? '<span aria-hidden="true">*</span>' : '';
  const help = f.help ? `<small>${t(f.help[0], f.help[1])}</small>` : '';
  const wrapperClass = `field${f.full ? ' full' : ''}`;
  let control = '';

  if (f.type === 'textarea') {
    control = `<textarea id="${id}" name="${key}" rows="${f.rows || 4}" ${f.required ? 'required' : ''}></textarea>`;
  } else if (f.type === 'select') {
    const options = f.options.map(([value, en, hi]) => `<option value="${escapeHtml(value)}">${escapeHtml(t(en, hi))}</option>`).join('');
    control = `<select id="${id}" name="${key}" ${f.required ? 'required' : ''}>${options}</select>`;
  } else if (f.type === 'checkbox') {
    return `<div class="${wrapperClass}"><label class="checkbox-field"><input id="${id}" name="${key}" type="checkbox" ${f.required ? 'required' : ''}> <span>${escapeHtml(t(f.label[0], f.label[1]))} ${required}</span></label>${help}</div>`;
  } else {
    control = `<input id="${id}" name="${key}" type="${f.type}" ${f.required ? 'required' : ''} ${f.autocomplete ? `autocomplete="${f.autocomplete}"` : ''}>`;
  }
  return `<div class="${wrapperClass}"><label for="${id}">${escapeHtml(t(f.label[0], f.label[1]))} ${required}</label>${control}${help}</div>`;
}

function renderAction() {
  const config = actions[activeAction];
  $('#generatorIntro').innerHTML = `<div class="generator-intro"><h3>${escapeHtml(t(config.title[0], config.title[1]))}</h3><p>${escapeHtml(t(config.intro[0], config.intro[1]))}</p><div class="generator-alert">${escapeHtml(t(config.alert[0], config.alert[1]))}</div></div>`;
  $('#actionForm').innerHTML = `<div class="form-grid">${config.fields.map(renderField).join('')}</div>`;
  $('#outputWrap').hidden = true;
  $('#documentOutput').value = '';
  applyLanguageText();
}

function formValues() {
  const data = {};
  new FormData($('#actionForm')).forEach((value, key) => { data[key] = String(value).trim(); });
  $$('input[type="checkbox"]', $('#actionForm')).forEach(input => { data[input.name] = input.checked; });
  return data;
}

function validateForm() {
  let valid = true;
  $$('input, textarea, select', $('#actionForm')).forEach(input => {
    input.classList.remove('invalid');
    if (input.required && ((input.type === 'checkbox' && !input.checked) || (input.type !== 'checkbox' && !input.value.trim()))) {
      input.classList.add('invalid');
      valid = false;
    }
  });
  if (!valid) {
    showToast(t('Complete every required field marked with *.', 'कृपया * से चिह्नित सभी आवश्यक फ़ील्ड भरें।'));
    $('.invalid', $('#actionForm'))?.focus();
  }
  return valid;
}

const line = (label, value) => value ? `${label}: ${value}` : '';
const section = (title, body) => body ? `\n${title}\n${'-'.repeat(Math.min(title.length, 58))}\n${body}\n` : '';
const dateText = d => d || '[date]';
const optionText = (fieldName, value) => {
  const option = fields[fieldName]?.options?.find(item => item[0] === value);
  return option ? option[lang() === 'hi' ? 2 : 1] : value;
};
const roleText = value => optionText('role', value);
const joinLocation = d => [dateText(d.date), d.time || '', d.location || ''].filter(Boolean).join(lang() === 'hi' ? ' पर ' : ' at ');
const declaration = d => lang() === 'hi'
  ? `मैं पुष्टि करता/करती हूँ कि इस अभ्यावेदन में दी गई जानकारी मेरी सर्वोत्तम जानकारी और विश्वास के अनुसार सत्य है। मैंने स्वयं ज्ञात तथ्यों, दूसरों से प्राप्त जानकारी और सार्वजनिक रिपोर्टों के बीच अंतर बनाए रखा है। मैं समझता/समझती हूँ कि जानबूझकर झूठी जानकारी देने के कानूनी परिणाम हो सकते हैं।`
  : `I confirm that the information in this representation is true to the best of my knowledge and belief. I have distinguished personal knowledge from information received from others and from public reports. I understand that knowingly providing false information may have legal consequences.`;

function englishHeader(to, subject, d) {
  return `To\n${to}\n\nSubject: ${subject}\n\nRespected Sir/Madam,\n\nI, ${d.name}, residing at ${d.address}, respectfully submit the following:`;
}

function hindiHeader(to, subject, d) {
  return `सेवा में\n${to}\n\nविषय: ${subject}\n\nमहोदय/महोदया,\n\nमैं, ${d.name}, निवासी ${d.address}, सम्मानपूर्वक निम्नलिखित प्रस्तुत करता/करती हूँ:`;
}

function contactBlock(d) {
  return lang() === 'hi'
    ? [line('ईमेल', d.email), line('टेलीफोन', d.phone), line('मामले से संबंध', roleText(d.role)), line('पहचान संदर्भ', d.idref)].filter(Boolean).join('\n')
    : [line('Email', d.email), line('Telephone', d.phone), line('Connection to the matter', roleText(d.role)), line('Identification reference', d.idref)].filter(Boolean).join('\n');
}

function closing(d) {
  return lang() === 'hi'
    ? `\nघोषणा\n------\n${declaration(d)}\n\nभवदीय,\n${d.name}\n${d.address}\n${d.email}\n${d.phone}\nदिनांक: ${new Date().toLocaleDateString('hi-IN')}\n\nसंलग्नक: कृपया भेजने से पहले सभी सहायक दस्तावेज़ों की क्रमांकित सूची जोड़ें।`
    : `\nDeclaration\n-----------\n${declaration(d)}\n\nRespectfully,\n${d.name}\n${d.address}\n${d.email}\n${d.phone}\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nEnclosures: Before sending, add a numbered index of every supporting document.`;
}

function buildNhrc(d) {
  const informationOnly = d.role === 'concerned citizen relying on identified public reports';
  if (lang() === 'hi') {
    const subject = informationOnly ? 'कथित मानवाधिकार उल्लंघन पर सूचना और स्वतः संज्ञान के विचार का अनुरोध' : 'सार्वजनिक प्राधिकरण द्वारा कथित मानवाधिकार उल्लंघन संबंधी शिकायत';
    return `${hindiHeader('माननीय अध्यक्ष / शिकायत रजिस्ट्री\nराष्ट्रीय मानवाधिकार आयोग\nमानव अधिकार भवन, ब्लॉक-C, GPO कॉम्प्लेक्स, INA, नई दिल्ली – 110023', subject, d)}
${section('शिकायतकर्ता का विवरण', contactBlock(d))}${section('प्रभावित व्यक्ति', `${d.affected}\nशिकायतकर्ता की भूमिका: ${roleText(d.role)}`)}${section('जिस लोक सेवक/प्राधिकरण के विरुद्ध विषय है', d.respondentAuthority)}${section('अदालत या राज्य मानवाधिकार आयोग में समान मामला', optionText('sameForum', d.sameForum))}${section('घटना', `तारीख/समय/स्थान: ${joinLocation(d)}\n\n${d.facts}`)}${section('चोट और चिकित्सा', d.medical)}${section('उपलब्ध साक्ष्य', d.evidence)}${section('पहले की शिकायतें/कार्यवाही', d.prior)}${section('अनुरोधित कार्रवाई', `${d.relief}\n\nमैं आयोग से अनुरोध करता/करती हूँ कि ${informationOnly ? 'इस विशिष्ट सूचना को दर्ज कर स्वतः संज्ञान लेने पर विचार किया जाए' : 'शिकायत पंजीकृत कर डायरी नंबर प्रदान किया जाए'}, संबंधित प्राधिकरण से रिपोर्ट मांगी जाए, अपने अधिकार क्षेत्र में प्रासंगिक साक्ष्य को सुरक्षित करने के कदम उठाए जाएँ, और अधिनियम के अंतर्गत उचित जांच, अंतरिम राहत की सिफारिश या अन्य उपायों पर विचार किया जाए।`)}${closing(d)}`;
  }
  const subject = informationOnly ? 'Information concerning alleged human-rights violations and request for possible suo motu consideration' : actions.nhrc.subject;
  return `${englishHeader('The Chairperson / Complaints Registry\nNational Human Rights Commission\nManav Adhikar Bhawan, Block-C, GPO Complex, INA, New Delhi – 110023', subject, d)}
${section('Complainant details', contactBlock(d))}${section('Affected person', `${d.affected}\nComplainant capacity: ${roleText(d.role)}`)}${section('Public servant or authority complained against', d.respondentAuthority)}${section('Same matter before a court or State Human Rights Commission', optionText('sameForum', d.sameForum))}${section('Incident', `Date/time/location: ${joinLocation(d)}\n\n${d.facts}`)}${section('Injury and medical treatment', d.medical)}${section('Evidence available', d.evidence)}${section('Prior complaints or proceedings', d.prior)}${section('Relief requested', `${d.relief}\n\nI request that the Commission ${informationOnly ? 'record this specific information and consider taking suo motu cognizance' : 'register this complaint and provide a diary number'}, call for a report from the responsible authority, take steps within its jurisdiction to secure and preserve relevant evidence, and consider an inquiry, a recommendation for interim relief, or other measures available under the Act.`)}${closing(d)}`;
}

function buildPolice(d) {
  const destination = {
    crime: {
      en: 'The Station House Officer concerned / Commissioner of Police, Delhi',
      hi: 'संबंधित थाना प्रभारी / पुलिस आयुक्त, दिल्ली'
    },
    vigilance: {
      en: 'Special Commissioner of Police (Vigilance)\nDelhi Police\nCopy: Commissioner of Police, Delhi',
      hi: 'विशेष पुलिस आयुक्त (सतर्कता)\nदिल्ली पुलिस\nप्रतिलिपि: पुलिस आयुक्त, दिल्ली'
    },
    pca: {
      en: 'The Chairperson\nPolice Complaints Authority\n10th Floor, Chanderlok Building, Janpath, New Delhi – 110001',
      hi: 'अध्यक्ष\nपुलिस शिकायत प्राधिकरण\n10वीं मंजिल, चंदरलोक बिल्डिंग, जनपथ, नई दिल्ली – 110001'
    }
  }[d.policeDestination];
  const preservation = lang() === 'hi'
    ? 'कृपया अपने अधिकार क्षेत्र में संबंधित CCTV, पुलिस वीडियोग्राफी, ड्रोन/बॉडी-कैम फुटेज (यदि कोई हो), वायरलेस और कंट्रोल-रूम लॉग, ड्यूटी रोस्टर, वाहन तैनाती, स्टेशन डायरी, गिरफ्तारी/हिरासत रिकॉर्ड और इलेक्ट्रॉनिक संचार सुरक्षित रखने के लिए विधिसम्मत कदम उठाएँ।'
    : 'Please take lawful steps within your jurisdiction to secure and preserve relevant CCTV, police videography, drone/body-camera footage (if any), wireless and control-room logs, duty rosters, vehicle deployment records, station diaries, arrest/detention records and relevant electronic communications.';
  if (lang() === 'hi') {
    return `${hindiHeader(destination.hi, 'कथित पुलिस दुराचार की शिकायत और साक्ष्य संरक्षण अनुरोध', d)}
${section('शिकायतकर्ता का विवरण', contactBlock(d))}${section('प्रभावित व्यक्ति', `${d.affected}\nभूमिका: ${roleText(d.role)}`)}${section('घटना', `तारीख/समय/स्थान: ${joinLocation(d)}\nपुलिस थाना/इकाई/अधिकारी/वाहन: ${d.policeUnit || 'अज्ञात'}\n\n${d.facts}`)}${section('चोट और उपचार', d.medical)}${section('साक्ष्य', d.evidence)}${section('पहले की शिकायतें/कार्यवाही', d.prior)}${section('अनुरोध', `${d.relief}\n\n${preservation}\n\nकृपया शिकायत संख्या, मामला संभालने वाले अधिकारी का नाम और समयबद्ध लिखित कार्रवाई रिपोर्ट प्रदान करें। यह शिकायत किसी विशिष्ट व्यक्ति को दोषी घोषित करने के लिए नहीं, बल्कि आपके अधिकार क्षेत्र में निष्पक्ष और साक्ष्य-आधारित परीक्षण के लिए है।`)}${closing(d)}`;
  }
  return `${englishHeader(destination.en, actions.police.subject, d)}
${section('Complainant details', contactBlock(d))}${section('Affected person', `${d.affected}\nCapacity: ${roleText(d.role)}`)}${section('Incident', `Date/time/location: ${joinLocation(d)}\nPolice station/unit/officer/vehicle: ${d.policeUnit || 'Not known'}\n\n${d.facts}`)}${section('Injury and treatment', d.medical)}${section('Evidence', d.evidence)}${section('Prior complaints or proceedings', d.prior)}${section('Request', `${d.relief}\n\n${preservation}\n\nPlease provide a complaint number, the name of the officer handling the matter and a time-bound written action-taken report. This complaint does not ask that any individual be presumed guilty; it requests a fair, impartial and evidence-based examination within your jurisdiction.`)}${closing(d)}`;
}

function buildSupreme(d) {
  const rights = lang() === 'hi'
    ? 'वर्णित तथ्य संविधान के अनुच्छेद 14, 19, 21 और 22 से संबंधित गंभीर प्रश्न उठा सकते हैं। मैं अनुरोध करता/करती हूँ कि इस पत्र की आधिकारिक PIL दिशानिर्देशों के अनुसार जांच की जाए।'
    : 'The stated facts may raise serious questions under Articles 14, 19, 21 and 22 of the Constitution. I request that this letter be screened under the Court’s official PIL Guidelines.';
  if (lang() === 'hi') {
    return `${hindiHeader('माननीय भारत के मुख्य न्यायाधीश\nरजिस्ट्रार (न्यायिक) / PIL सेल के माध्यम से\nभारत का सर्वोच्च न्यायालय\nतिलक मार्ग, नई दिल्ली – 110001', 'मौलिक अधिकारों के कथित उल्लंघन के संबंध में तत्काल अभ्यावेदन', d)}
${section('आवेदक का विवरण', contactBlock(d))}${section('प्रभावित व्यक्ति और आवेदक की भूमिका', `${d.affected}\n${roleText(d.role)}`)}${section('प्रभावित समूह और जनमहत्व', d.pilClass)}${section('पत्र-PIL दिशानिर्देश का आधार', d.pilBasis)}${section('समान विषय पर लंबित मामला', optionText('pendingCase', d.pendingCase))}${section('तथ्य', `तारीख/समय/स्थान: ${joinLocation(d)}\n\n${d.facts}`)}${section('संवैधानिक चिंता', rights)}${section('चोट/हिरासत/चिकित्सा', d.medical)}${section('साक्ष्य', d.evidence)}${section('संबंधित शिकायतें और कार्यवाही', d.prior || 'मेरी जानकारी में कोई नहीं। भेजने से पहले इसकी पुष्टि की जाएगी।')}${section('अनुरोधित राहत', `${d.relief}\n\nतात्कालिक रूप से मैं संबंधित CCTV, पुलिस वीडियो, वायरलेस/कंट्रोल-रूम लॉग, हिरासत रिकॉर्ड और अन्य इलेक्ट्रॉनिक साक्ष्य के संरक्षण; हिरासत/गिरफ्तारी/चोट की सत्यापित सूची; वकील से संपर्क, नामित रिश्तेदार/मित्र को सूचना और चिकित्सा सहायता; तथा न्यायालय द्वारा उचित समझी जाने वाली अन्य सुरक्षा पर विचार का अनुरोध करता/करती हूँ।`)}
मैं समझता/समझती हूँ कि यह ईमेल/पत्र स्वयं अनुच्छेद 32 की रिट याचिका नहीं है और अदालत में मामला स्वतः शुरू नहीं करता। मैं आवश्यक होने पर शपथपत्र और औपचारिक याचिका दाखिल करने तथा संबंधित कार्यवाही का पूरा खुलासा करने को तैयार हूँ।
${closing(d)}`;
  }
  return `${englishHeader('The Hon’ble Chief Justice of India\nThrough the Registrar (Judicial) / PIL Cell\nSupreme Court of India\nTilak Marg, New Delhi – 110001', actions.supreme.subject, d)}
${section('Applicant details', contactBlock(d))}${section('Affected person and applicant capacity', `${d.affected}\n${roleText(d.role)}`)}${section('Affected group and public importance', d.pilClass)}${section('Basis under the letter-PIL guidelines', d.pilBasis)}${section('Pending case concerning the same matter', optionText('pendingCase', d.pendingCase))}${section('Facts', `Date/time/location: ${joinLocation(d)}\n\n${d.facts}`)}${section('Constitutional concern', rights)}${section('Injury, detention or medical information', d.medical)}${section('Evidence', d.evidence)}${section('Related complaints and proceedings', d.prior || 'None known to me. This will be verified before submission.')}${section('Relief requested', `${d.relief}\n\nAs immediate protective measures, I request consideration of preservation of relevant CCTV, police video, wireless/control-room logs, detention records and other electronic evidence; a verified list of persons detained, arrested or injured; access to counsel, notification of a nominated relative or friend, medical assistance; and any other protection the Hon’ble Court considers appropriate.`)}
I understand that this email/letter is not itself an Article 32 writ petition and does not automatically commence a judicial proceeding. I am willing to file an affidavit and formal petition if required and to make full disclosure of related proceedings.
${closing(d)}`;
}

function buildLegalAid(d) {
  const scopeNote = d.aidDestination === 'sclsc'
    ? t('I understand that SCLSC states it does not grant legal aid to file PILs. This request concerns an eligible non-PIL Supreme Court matter and remains subject to statutory eligibility and a prima-facie assessment.', 'मैं समझता/समझती हूँ कि SCLSC के अनुसार PIL दाखिल करने के लिए कानूनी सहायता नहीं दी जाती। यह अनुरोध पात्र गैर-PIL सुप्रीम कोर्ट मामले से संबंधित है और वैधानिक पात्रता तथा प्रथमदृष्टया आकलन के अधीन है।')
    : t('I understand that assistance is subject to statutory eligibility, urgency and assessment by the legal-services authority.', 'मैं समझता/समझती हूँ कि सहायता वैधानिक पात्रता, तात्कालिकता और कानूनी सेवा प्राधिकरण के आकलन के अधीन है।');
  if (lang() === 'hi') {
    return `${hindiHeader(d.aidDestination === 'sclsc' ? 'सचिव / फ्रंट ऑफिस\nसुप्रीम कोर्ट लीगल सर्विसेज कमेटी' : 'सचिव / फ्रंट ऑफिस\nदिल्ली राज्य विधिक सेवा प्राधिकरण', 'तत्काल कानूनी सहायता हेतु अनुरोध', d)}
${section('आवेदक का विवरण', contactBlock(d))}${section('प्रभावित व्यक्ति', `${d.affected}\nसंबंध: ${d.relation}\nआवेदक की भूमिका: ${roleText(d.role)}`)}${section('सेवा का दायरा', scopeNote)}${section('तात्कालिक स्थिति', `तारीख/समय/स्थान: ${joinLocation(d)}\nअंतिम ज्ञात हिरासत/स्थान: ${d.custody}\n\n${d.facts}`)}${section('चिकित्सा स्थिति', d.medical)}${section('साक्ष्य/दस्तावेज़', d.evidence)}${section('पहले उठाए गए कदम', d.prior)}${section('आवश्यक सहायता', `${d.relief}\n\nकृपया पात्रता और तात्कालिकता का शीघ्र आकलन कर वकील/पैरा-लीगल सहायता, हिरासत सत्यापन, चिकित्सा और नामित व्यक्ति को सूचना, तथा आवश्यक अदालत या प्रशासनिक कार्रवाई में सहायता प्रदान करें।`)}${closing(d)}`;
  }
  return `${englishHeader(d.aidDestination === 'sclsc' ? 'The Secretary / Front Office\nSupreme Court Legal Services Committee' : 'The Secretary / Front Office\nDelhi State Legal Services Authority', actions.legalaid.subject, d)}
${section('Applicant details', contactBlock(d))}${section('Affected person', `${d.affected}\nRelationship: ${d.relation}\nApplicant capacity: ${roleText(d.role)}`)}${section('Scope of legal services', scopeNote)}${section('Urgent situation', `Date/time/location: ${joinLocation(d)}\nLast known custody/location: ${d.custody}\n\n${d.facts}`)}${section('Medical condition', d.medical)}${section('Evidence and documents', d.evidence)}${section('Steps already taken', d.prior)}${section('Assistance requested', `${d.relief}\n\nPlease urgently assess eligibility and urgency and assist with legal or para-legal representation, verification of custody, medical care, notification of the nominated person, and any necessary court or administrative action.`)}${closing(d)}`;
}

function buildNeet(d) {
  const recipient = d.neetRoute === 'mcc'
    ? { en: 'The Medical Counselling Committee (MCC)', hi: 'चिकित्सा परामर्श समिति (MCC)' }
    : d.neetRoute === 'state'
      ? { en: d.neetAuthority, hi: d.neetAuthority }
      : { en: 'The Director (Exams) / NEET (UG) Helpdesk\nNational Testing Agency\nFirst Floor, NSIC-MDBP Building, Okhla Industrial Estate, New Delhi – 110020', hi: 'निदेशक (परीक्षा) / NEET (UG) हेल्पडेस्क\nराष्ट्रीय परीक्षण एजेंसी\nप्रथम तल, NSIC-MDBP बिल्डिंग, ओखला इंडस्ट्रियल एस्टेट, नई दिल्ली – 110020' };
  if (lang() === 'hi') {
    return `${hindiHeader(recipient.hi, 'NEET (UG) 2026 उम्मीदवार शिकायत और लिखित समाधान का अनुरोध', d)}
${section('मार्ग और जिम्मेदार प्राधिकरण', `${optionText('neetRoute', d.neetRoute)}\n${d.neetAuthority}`)}${section('2026 समयसीमा की समझ', 'मैं समझता/समझती हूँ कि उत्तर-कुंजी चुनौती 25–28 जून, OMR/दर्ज उत्तर पहुँच 13–15 जुलाई और अंतिम उत्तर कुंजी/परिणाम 16 जुलाई को था। ईमेल या CPGRAMS समयसीमा दोबारा नहीं खोलता।')}${section('उम्मीदवार विवरण', `नाम: ${d.name}\nआवेदन संख्या: ${d.application}\nपरीक्षा शहर/केंद्र: ${d.examCity}\nपता: ${d.address}\nईमेल: ${d.email}\nफोन: ${d.phone}`)}${section('शिकायत के तथ्य', d.facts)}${section('उम्मीदवार पर विशिष्ट प्रभाव', d.candidateImpact)}${section('सहायक दस्तावेज़', d.evidence)}${section('पहले उठाए गए कदम', d.prior)}${section('अनुरोधित समाधान', `${d.relief}\n\nकृपया इस शिकायत को पंजीकृत कर संदर्भ संख्या प्रदान करें, प्रासंगिक रिकॉर्ड की समीक्षा करें और कारण सहित लिखित उत्तर दें। उम्मीदवार की व्यक्तिगत जानकारी गोपनीय रखी जाए।`)}${closing(d)}`;
  }
  return `${englishHeader(recipient.en, actions.neet.subject, d)}
${section('Route and responsible authority', `${optionText('neetRoute', d.neetRoute)}\n${d.neetAuthority}`)}${section('Acknowledgment of the 2026 deadlines', 'I understand that the answer-key challenge ran 25–28 June, OMR/recorded-response access ran 13–15 July, and the final answer key/result was published 16 July. Email or CPGRAMS does not reopen a deadline.')}${section('Candidate details', `Name: ${d.name}\nApplication number: ${d.application}\nExamination city/centre: ${d.examCity}\nAddress: ${d.address}\nEmail: ${d.email}\nTelephone: ${d.phone}`)}${section('Facts of the grievance', d.facts)}${section('Specific impact on the candidate', d.candidateImpact)}${section('Supporting documents', d.evidence)}${section('Prior steps', d.prior)}${section('Resolution requested', `${d.relief}\n\nPlease register this grievance, provide a reference number, review the relevant records and issue a reasoned written response. The candidate’s personal information should be kept confidential.`)}${closing(d)}`;
}

function rtiClosing(d) {
  return lang() === 'hi'
    ? `\nभवदीय,\n${d.name}\n${d.address}\n${d.email}\n${d.phone}\nदिनांक: ${new Date().toLocaleDateString('hi-IN')}\n\nदस्तावेज़: घटना-साक्ष्य, आधार, PAN या असंबंधित पहचान सामग्री संलग्न न करें। BPL शुल्क छूट मांगने पर केवल आवश्यक BPL प्रमाण, या वास्तव में आवश्यक हो तो जारी रखने का पृष्ठ जोड़ें।`
    : `\nRespectfully,\n${d.name}\n${d.address}\n${d.email}\n${d.phone}\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nDocuments: Do not attach incident evidence, Aadhaar, PAN, or unrelated identity material. Attach only required BPL proof when claiming the fee exemption, or a continuation sheet if genuinely needed.`;
}

function buildRti(d) {
  const urgency = d.rtiUrgency === 'life'
    ? t('This request has a direct connection to the life or liberty of an identified person. Nexus: please see the direct connection between the records requested and the facts stated below. Please provide the information within 48 hours under section 7(1).', 'यह अनुरोध एक पहचाने गए व्यक्ति के जीवन या स्वतंत्रता से सीधे जुड़ा है। संबंध: कृपया नीचे मांगे गए रिकॉर्ड और तथ्यों से सीधा संबंध देखें। धारा 7(1) के अनुसार 48 घंटे में सूचना प्रदान की जाए।')
    : t('This is an ordinary RTI request. Please respond within the ordinary period under section 7(1), normally 30 days.', 'यह सामान्य RTI अनुरोध है। धारा 7(1) के अनुसार सामान्य समयसीमा में उत्तर प्रदान किया जाए।');
  if (lang() === 'hi') {
    return `${hindiHeader(`केंद्रीय लोक सूचना अधिकारी (CPIO)\n${d.authority}`, 'सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के तहत आवेदन', d)}
मैं भारत का नागरिक हूँ और निम्न मौजूदा अभिलेख/सूचना ${optionText('rtiFormat', d.rtiFormat)} के रूप में चाहता/चाहती हूँ।
${section('उत्तर अवधि', urgency)}
${section('मांगी गई सूचना', d.records)}
कृपया:
1. मांगी गई सूचना उपलब्ध रिकॉर्ड के अनुसार प्रदान करें।
2. किसी भाग से इनकार हो तो लागू धारा और कारण स्पष्ट करें तथा शेष भाग प्रदान करें।
3. यदि सूचना किसी अन्य सार्वजनिक प्राधिकरण के पास है तो अधिनियम की धारा 6(3) के तहत स्थानांतरित करें और मुझे सूचित करें।
4. अतिरिक्त शुल्क हो तो गणना सहित सूचित करें।
5. जहाँ कानून अनुमति देता है, चुने गए रूप में सूचना प्रदान करें।

आवेदक का पता: ${d.address}
ईमेल: ${d.email}
फोन: ${d.phone}
नागरिकता: भारतीय नागरिक (पुष्टि की गई)
आवेदन शुल्क: सामान्यतः ₹10; BPL आवेदक के लिए आवश्यक प्रमाण के साथ शुल्क छूट लागू हो सकती है।
${rtiClosing(d)}`;
  }
  return `${englishHeader(`The Central Public Information Officer (CPIO)\n${d.authority}`, actions.rti.subject, d)}
I am a citizen of India and seek the following existing records or information as ${optionText('rtiFormat', d.rtiFormat)} under section 6(1) of the Right to Information Act, 2005:
${section('Response period', urgency)}
${section('Information requested', d.records)}
Please:
1. Provide the requested information as it exists on record.
2. If any part is denied, identify the precise exemption and reasons, and provide the severable remainder.
3. If the information is held by another public authority, transfer the application under section 6(3) and inform me.
4. Inform me of any additional fee with the calculation.
5. Provide access in the selected form where legally permissible.

Applicant address: ${d.address}
Email: ${d.email}
Telephone: ${d.phone}
Citizenship: Indian citizen (confirmed)
Application fee: ordinarily ₹10; the BPL fee exemption may apply with the required proof.
${rtiClosing(d)}`;
}

function buildWitness(d) {
  if (lang() === 'hi') {
    return `प्रत्यक्षदर्शी का तथ्यात्मक बयान
============================

1. गवाह का विवरण
नाम: ${d.name}
पता: ${d.address}
ईमेल: ${d.email}
टेलीफोन: ${d.phone}

2. घटना
तारीख/समय/स्थान: ${joinLocation(d)}

3. मेरी स्थिति और देखने/सुनने की क्षमता
${d.witnessPosition}

4. जो मैंने स्वयं देखा या सुना
${d.facts}

5. दूसरों या सार्वजनिक रिपोर्टों से मिली जानकारी
${d.sourceDistinction || 'कोई नहीं / लागू नहीं'}

6. साक्ष्य
${d.evidence || 'कोई सूचीबद्ध नहीं'}

7. घोषणा
${declaration(d)}

स्थान: ____________________
दिनांक: ____________________
हस्ताक्षर: ____________________

नोट: हस्ताक्षरित मूल प्रति निजी रखें। यदि वकील सलाह दे तो इसे शपथपत्र/हलफनामे के रूप में सत्यापित कराएं।`;
  }
  return `FACTUAL WITNESS STATEMENT
===========================

1. Witness details
Name: ${d.name}
Address: ${d.address}
Email: ${d.email}
Telephone: ${d.phone}

2. Incident
Date/time/location: ${joinLocation(d)}

3. My position and ability to see/hear
${d.witnessPosition}

4. What I personally saw or heard
${d.facts}

5. Information learned from others or public reports
${d.sourceDistinction || 'None / not applicable'}

6. Evidence
${d.evidence || 'None listed'}

7. Declaration
${declaration(d)}

Place: ____________________
Date: _____________________
Signature: _________________

Note: Keep the signed original private. If advised by counsel, have it formally verified as an affidavit.`;
}

function buildCustody(d) {
  if (lang() === 'hi') {
    return `${hindiHeader('पुलिस आयुक्त, दिल्ली / संबंधित थाना प्रभारी\nप्रतिलिपि: दिल्ली राज्य विधिक सेवा प्राधिकरण', 'हिरासत, ठिकाने और कानूनी पहुँच की तत्काल पुष्टि का अनुरोध', d)}
${section('अनुरोधकर्ता का विवरण', `${contactBlock(d)}\nप्रभावित व्यक्ति से संबंध: ${d.relation}`)}${section('लापता/हिरासत में व्यक्ति', d.affected)}${section('अंतिम ज्ञात विवरण', `तारीख/समय/स्थान: ${joinLocation(d)}\n${d.custody}`)}${section('ज्ञात तथ्य', d.facts)}${section('चिकित्सा चिंता', d.medical)}${section('साक्ष्य', d.evidence)}${section('पहले उठाए गए कदम', d.prior)}${section('तत्काल अनुरोध', `${d.relief}\n\nकृपया तत्काल लिखित रूप से पुष्टि करें: (1) क्या व्यक्ति हिरासत में है और किस थाना/इकाई में; (2) गिरफ्तारी के दर्ज आधार और संख्या; (3) गिरफ्तारी मेमो, पहचान और गवाह का विवरण; (4) नामित रिश्तेदार/मित्र को सूचना और थाने में उसका रिकॉर्ड; (5) नामित गिरफ्तारी-सूचना अधिकारी/प्रदर्शित सूचना; (6) मेडिकल जांच और रिपोर्ट की प्रति; (7) पूछताछ के दौरान वकील से मिलने का अवसर; और (8) यात्रा समय छोड़कर 24 घंटे के भीतर निकटतम मजिस्ट्रेट के सामने पेशी का समय। यदि व्यक्ति हिरासत में नहीं है तो अंतिम उपलब्ध आधिकारिक जानकारी बताएं।`)}
यह अनुरोध किसी वैध जांच में बाधा डालने के लिए नहीं है। इसका उद्देश्य व्यक्ति की सुरक्षा, स्थान और कानूनसम्मत प्रक्रिया सुनिश्चित करना है।
${closing(d)}`;
  }
  return `${englishHeader('Commissioner of Police, Delhi / Station House Officer concerned\nCopy: Delhi State Legal Services Authority', actions.custody.subject, d)}
${section('Requestor details', `${contactBlock(d)}\nRelationship to affected person: ${d.relation}`)}${section('Person reportedly detained or missing', d.affected)}${section('Last known details', `Date/time/location: ${joinLocation(d)}\n${d.custody}`)}${section('Known facts', d.facts)}${section('Medical concern', d.medical)}${section('Evidence', d.evidence)}${section('Prior steps', d.prior)}${section('Urgent request', `${d.relief}\n\nPlease immediately confirm in writing: (1) whether the person is in custody and at which station or unit; (2) the recorded grounds and number for arrest; (3) arrest-memo, identification and witness details; (4) notification of the nominated relative or friend and its station record; (5) the designated arrest-information officer or displayed custody information; (6) medical examination and a copy of the report; (7) opportunity to meet an advocate during interrogation; and (8) the time of production before the nearest magistrate within 24 hours, excluding journey time. If the person is not in custody, please provide the last available official information.`)}
This request is not intended to obstruct any lawful investigation. It seeks to ensure the person’s safety, location and due process of law.
${closing(d)}`;
}

const builders = { nhrc: buildNhrc, police: buildPolice, supreme: buildSupreme, legalaid: buildLegalAid, neet: buildNeet, rti: buildRti, witness: buildWitness, custody: buildCustody };

function generateDocument() {
  if (!validateForm()) return;
  const data = formValues();
  const output = builders[activeAction](data).replace(/\n{3,}/g, '\n\n').trim();
  $('#documentOutput').value = output;
  $('#outputTitle').textContent = t(actions[activeAction].title[0], actions[activeAction].title[1]);
  configureOutput(data, output);
  $('#outputWrap').hidden = false;
  $('#outputWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function configureOutput(data, output) {
  let channel = official[activeAction];
  let disableMail = false;
  if (activeAction === 'legalaid') {
    channel = data.aidDestination === 'sclsc'
      ? { email: 'sclsc@nic.in', portal: 'https://sclsc.gov.in/', label: 'Supreme Court Legal Services Committee' }
      : { email: 'lae-dslsa@gov.in', portal: 'https://dslsa.org/', label: 'Delhi State Legal Services Authority' };
  }
  if (activeAction === 'police') {
    channel = data.policeDestination === 'pca'
      ? { email: 'pca.delhi@nic.in', portal: 'https://pca.delhi.gov.in/', label: 'Delhi Police Complaints Authority' }
      : data.policeDestination === 'vigilance'
        ? official.police
        : { email: '', portal: 'https://cctns.delhipolice.gov.in/citizen/', label: 'Delhi Police citizen portal' };
  }
  if (activeAction === 'neet') {
    channel = data.neetRoute === 'mcc'
      ? { email: '', portal: 'https://mcc.nic.in/', label: 'Medical Counselling Committee' }
      : data.neetRoute === 'state'
        ? { email: '', portal: 'https://neet.nta.nic.in/counselling-for-neet-ug/', label: 'official counselling directory' }
        : { email: 'neetug2026@nta.ac.in', portal: 'https://neet.nta.nic.in/documents/', label: 'NEET official notices' };
  }
  if (activeAction === 'supreme' && data.pendingCase !== 'no') disableMail = true;
  const subject = lang() === 'hi' ? actions[activeAction].title[1] : actions[activeAction].subject;
  const mail = $('#emailButton');
  if (channel.email && !disableMail) {
    const params = new URLSearchParams({ subject, body: output });
    if (channel.cc) params.set('cc', channel.cc);
    mail.href = `mailto:${channel.email}?${params.toString()}`;
    mail.hidden = false;
  } else {
    mail.hidden = true;
  }
  const portal = $('#portalButton');
  portal.href = channel.portal;
  portal.textContent = lang() === 'hi' ? `आधिकारिक पोर्टल खोलें` : `Open ${channel.label}`;

  const specific = {
    nhrc: [
      ['Submit through the online portal when possible and save the diary number.', 'जहाँ संभव हो ऑनलाइन पोर्टल से जमा करें और डायरी नंबर सुरक्षित रखें।'],
      ['Review the HRCNet choices about public display of complainant and victim names before submitting.', 'जमा करने से पहले शिकायतकर्ता और पीड़ित का नाम सार्वजनिक दिखाने संबंधी HRCNet विकल्प जाँचें।'],
      ['Track the complaint and record every response.', 'शिकायत ट्रैक करें और हर उत्तर दर्ज करें।']
    ],
    police: [
      [data.policeDestination === 'pca' ? 'Submit to the Police Complaints Authority and keep a private copy.' : data.policeDestination === 'vigilance' ? 'Submit to Vigilance and remember it is an internal Delhi Police channel.' : 'If danger is current call 112; use the local police/FIR or official crime-report route.', data.policeDestination === 'pca' ? 'पुलिस शिकायत प्राधिकरण को जमा करें और निजी प्रति रखें।' : data.policeDestination === 'vigilance' ? 'सतर्कता को जमा करें और याद रखें कि यह दिल्ली पुलिस का आंतरिक माध्यम है।' : 'खतरा वर्तमान हो तो 112 कॉल करें; स्थानीय पुलिस/FIR या आधिकारिक अपराध-रिपोर्ट मार्ग लें।'],
      ['Request and save the complaint number.', 'शिकायत संख्या मांगें और सुरक्षित रखें।'],
      ['Escalate to legal aid or NHRC if there is immediate risk or no response.', 'तत्काल जोखिम या उत्तर न मिलने पर कानूनी सहायता या NHRC तक बढ़ाएं।']
    ],
    supreme: [
      ['Sign the PDF or physical letter and add an indexed annexure file.', 'PDF या भौतिक पत्र पर हस्ताक्षर करें और क्रमांकित संलग्नक फ़ाइल जोड़ें।'],
      ['The Court email is general correspondence, not a designated filing channel.', 'अदालत का ईमेल सामान्य पत्राचार है, दाखिले का निर्दिष्ट माध्यम नहीं।'],
      [data.pendingCase === 'no' ? 'For binding judicial orders, consult a Supreme Court Advocate-on-Record.' : 'A same-event case may be pending: use the formal case procedure through an Advocate-on-Record or permitted party-in-person; do not email a tagging request.', data.pendingCase === 'no' ? 'बाध्यकारी न्यायिक आदेश के लिए सुप्रीम कोर्ट एडवोकेट-ऑन-रिकॉर्ड से परामर्श करें।' : 'समान घटना का मामला लंबित हो सकता है: एडवोकेट-ऑन-रिकॉर्ड या अनुमत पार्टी-इन-पर्सन से औपचारिक प्रक्रिया लें; टैगिंग ईमेल न भेजें।']
    ],
    legalaid: [
      ['Call the legal-aid helpline when the matter is urgent.', 'मामला तत्काल हो तो कानूनी सहायता हेल्पलाइन पर कॉल करें।'],
      [data.aidDestination === 'sclsc' ? 'SCLSC does not grant legal aid to file PILs; eligibility for other Supreme Court matters still requires assessment.' : 'DSLSA will assess legal-aid eligibility, urgency and the appropriate Delhi route.', data.aidDestination === 'sclsc' ? 'SCLSC PIL दाखिल करने के लिए कानूनी सहायता नहीं देता; अन्य सुप्रीम कोर्ट मामलों की पात्रता का आकलन होगा।' : 'DSLSA कानूनी सहायता की पात्रता, तात्कालिकता और सही दिल्ली मार्ग का आकलन करेगा।'],
      ['Do not publish the affected person’s sensitive details.', 'प्रभावित व्यक्ति की संवेदनशील जानकारी सार्वजनिक न करें।']
    ],
    neet: [
      ['Use only the official route and deadline for the selected grievance type.', 'चुनी गई शिकायत के लिए केवल आधिकारिक मार्ग और समयसीमा उपयोग करें।'],
      ['Keep the portal acknowledgment and reference number.', 'पोर्टल की प्राप्ति और संदर्भ संख्या सुरक्षित रखें।'],
      ['CPGRAMS is an administrative escalation, not a substitute for a portal, statutory or court deadline.', 'CPGRAMS प्रशासनिक अनुवर्ती है; यह पोर्टल, वैधानिक या अदालती समयसीमा का विकल्प नहीं है।']
    ],
    rti: [
      ['Paste the request into the appropriate RTI portal.', 'अनुरोध उपयुक्त RTI पोर्टल में चिपकाएँ।'],
      ['Pay the ordinary ₹10 fee, or provide only the required BPL proof if claiming the exemption. Keep the request near the ordinary 500-word limit.', 'सामान्य ₹10 शुल्क दें, या BPL छूट मांगने पर केवल आवश्यक प्रमाण दें। अनुरोध को सामान्य 500-शब्द सीमा के आसपास रखें।'],
      ['Save the receipt. A first appeal is ordinarily filed within 30 days after the response or missed deadline.', 'रसीद रखें। उत्तर या समयसीमा चूकने के बाद प्रथम अपील सामान्यतः 30 दिन में दाखिल होती है।']
    ],
    witness: [
      ['Read the statement slowly and correct anything uncertain.', 'बयान ध्यान से पढ़ें और अनिश्चित बात सुधारें।'],
      ['Sign and date it; keep the original private.', 'हस्ताक्षर और तारीख डालें; मूल प्रति निजी रखें।'],
      ['Give it to a lawyer or competent authority, not a public spreadsheet.', 'इसे वकील या सक्षम प्राधिकरण को दें, सार्वजनिक स्प्रेडशीट में नहीं।']
    ],
    custody: [
      ['Call 112 and legal aid immediately if danger is current.', 'खतरा वर्तमान हो तो तुरंत 112 और कानूनी सहायता को कॉल करें।'],
      ['Record every police station contacted, time, name and response.', 'हर संपर्क किए पुलिस थाने, समय, नाम और उत्तर को दर्ज करें।'],
      ['Ask a lawyer whether urgent habeas corpus proceedings are needed.', 'वकील से पूछें कि क्या तत्काल बंदी प्रत्यक्षीकरण कार्यवाही आवश्यक है।']
    ]
  }[activeAction];
  $('#nextSteps').innerHTML = `<h4>${t('What to do next', 'आगे क्या करें')}</h4><ol>${specific.map(item => `<li>${escapeHtml(t(item[0], item[1]))}</li>`).join('')}</ol>`;
}

function applyLanguageText() {
  $$('[data-en][data-hi]').forEach(el => { el.textContent = lang() === 'hi' ? el.dataset.hi : el.dataset.en; });
  document.documentElement.lang = lang() === 'hi' ? 'hi' : 'en';
  $('#languageToggle').textContent = lang() === 'hi' ? 'English' : 'हिन्दी';
}

function switchLanguage() {
  document.documentElement.dataset.language = lang() === 'en' ? 'hi' : 'en';
  localStorage.setItem('jan-adhikar-language', lang());
  applyLanguageText();
  renderAction();
}

function clearForm() {
  $('#actionForm').reset();
  $('#outputWrap').hidden = true;
  $('#documentOutput').value = '';
}

function copyOutput() {
  navigator.clipboard.writeText($('#documentOutput').value)
    .then(() => showToast(t('Copied to clipboard.', 'क्लिपबोर्ड पर कॉपी किया गया।')))
    .catch(() => { $('#documentOutput').select(); document.execCommand('copy'); showToast(t('Copied.', 'कॉपी किया गया।')); });
}

function downloadOutput() {
  const blob = new Blob([$('#documentOutput').value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jan-adhikar-${activeAction}-${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

async function shareSite() {
  const shareData = {
    title: 'Jan Adhikar — India Civic Action & Rights Kit',
    text: 'Document what happened. Generate a truthful complaint. Reach the correct official channel.',
    url: location.href.split('#')[0]
  };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (_) { /* user cancelled */ }
  } else {
    await navigator.clipboard.writeText(shareData.url);
    showToast(t('Link copied.', 'लिंक कॉपी किया गया।'));
  }
}

function confirmEmailHandoff(event) {
  const message = t(
    'Opening email sends the draft to your email app or provider, which is outside Jan Adhikar. Long mailto drafts may be truncated. Review the recipient and consider downloading the document and attaching it instead. Continue?',
    'ईमेल खोलने पर मसौदा आपके ईमेल ऐप या प्रदाता के पास जाता है, जो Jan Adhikar से बाहर है। लंबा mailto मसौदा कट सकता है। प्राप्तकर्ता जाँचें और दस्तावेज़ डाउनलोड कर संलग्न करने पर विचार करें। जारी रखें?'
  );
  if (!window.confirm(message)) event.preventDefault();
}

async function refreshCurrentInformation() {
  const registration = await navigator.serviceWorker?.getRegistration?.();
  await registration?.update?.();
  location.reload();
}

function showToast(message) {
  $('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

function init() {
  document.documentElement.dataset.language = localStorage.getItem('jan-adhikar-language') || 'en';
  applyLanguageText();
  renderAction();
  $$('.action-tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.action-tab').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    activeAction = tab.dataset.action;
    renderAction();
    $('.generator-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  $('#languageToggle').addEventListener('click', switchLanguage);
  $('#generateButton').addEventListener('click', generateDocument);
  $('#clearButton').addEventListener('click', clearForm);
  $('#copyButton').addEventListener('click', copyOutput);
  $('#downloadButton').addEventListener('click', downloadOutput);
  $('#printButton').addEventListener('click', () => window.print());
  $('#emailButton').addEventListener('click', confirmEmailHandoff);
  $('#shareButton').addEventListener('click', shareSite);
  $('#refreshDataButton').addEventListener('click', refreshCurrentInformation);
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}

document.addEventListener('DOMContentLoaded', init);
