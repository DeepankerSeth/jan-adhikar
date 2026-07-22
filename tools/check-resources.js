#!/usr/bin/env node
'use strict';
// Consistency check between published contacts and the canonical ledger.
// Direction 1 (FAIL): every tel:/mailto: href in site/index.html must exist in
//   site/data/resources.json — adding a contact requires a ledger entry.
//   Removing a contact from the HTML never fails this check, so emergency
//   removals always deploy.
// Direction 2 (WARN): every published ledger entry should still appear in the
//   site or the emergency card; stale entries and passed recheck dates warn.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'site/index.html'), 'utf8');
const card = fs.readFileSync(path.join(root, 'site/downloads/emergency-card.txt'), 'utf8');
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'site/data/resources.json'), 'utf8'));

const ledgerHrefs = new Set();
for (const r of ledger.resources) (r.contact.hrefs || []).forEach(h => ledgerHrefs.add(h));

const usedHrefs = [...html.matchAll(/href="((?:tel|mailto):[^"]+)"/g)].map(m => m[1]);
let failures = 0;
for (const href of new Set(usedHrefs)) {
  if (!ledgerHrefs.has(href)) {
    console.error(`FAIL: ${href} is published in index.html but missing from resources.json`);
    failures++;
  }
}

const today = new Date().toISOString().slice(0, 10);
for (const r of ledger.resources) {
  if (!r.published || r.status !== 'active') continue;
  const strings = [...(r.contact.hrefs || []), ...(r.contact.text || []), ...(r.contact.urls || [])];
  const present = strings.some(s => html.includes(s) || card.includes(s));
  if (!present) console.warn(`WARN: ledger entry "${r.id}" not found in site or card`);
  if (r.recheck_after && r.recheck_after < today) console.warn(`WARN: "${r.id}" is past its recheck date (${r.recheck_after})`);
}

if (failures) {
  console.error(`\n${failures} unledgered contact(s). Add entries to site/data/resources.json (with source and verification date) or remove the links.`);
  process.exit(1);
}
console.log('check-resources: all published tel:/mailto: links are ledgered.');
