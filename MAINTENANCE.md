# Adhikar Sathi maintenance plan

Last full verification: **22 July 2026** (all contacts checked against official sources via search index; no number was dial-tested). Canonical record: `site/data/resources.json`.

## Re-verification cadence

| Category | Recheck by | Why |
|---|---|---|
| All short-code helplines (102, 108, 1091, 181, 1098, 14461, 1094) | **15 Sept 2026** | Supreme Court (May 2026) ordered legacy helplines merged into 112 within ~3 months. If a short code dies, the card's printed rule ("if any number fails: 112 / 15100") is the safety net — but the site must be updated. |
| Mobile numbers and emails (9870101337, 8591903601/02, all emails) | 15 Aug – 15 Sept 2026 | Mobile contacts churn fastest. Dial-test DLSA mobiles and 14461 before renewing. |
| City helplines, portals, tiplines | 1 Oct 2026 | Quarterly. |
| Hospitals, statutory bodies, legal text (BNSS/JJ/LSA) | 1 Jan 2027 | Stable; verify no amendment. |

**Demotion rule:** any resource past its `recheck_after` date that cannot be re-verified is removed from the public site and card at the next edit and its ledger `status` set to `retired` (with a note), never left published. Reduced scope beats wrong numbers.

## How to verify
Open the `source_url` in the ledger entry and confirm the contact still appears; prefer a second official source for mobile numbers. Dial-testing is better where feasible. Update `verified_at` and `recheck_after`. Never rely on third-party directories.

## Corrections
Wrong-number reports arrive at the footer email. Target: within 48 hours, either re-verify or **remove** the contact (removal first, investigation second — the CI check never blocks removals). Then update the ledger.

## Emergency updates
Edit on GitHub (web UI is fine) → commit to `main` → Pages deploys in ~1 minute. If assets changed, bump `CACHE` in `site/service-worker.js` (v4 → v5 …) so returning offline users pick up the fix on their next connected visit. The CI ledger check (`tools/check-resources.js`) fails only when a **new** tel:/mailto: link is missing from the ledger; removing links can never fail it.

## Offline staleness
The card and print card carry their verification date and the universal fallback line. Everything on them was chosen for stability (short codes, standing institutions, addresses). Volatile facts (metro closures, protest-specific offers, individual volunteers) are deliberately excluded from anything cacheable.

## Content rules (unchanged)
- No political-party, volunteer, or unverified private contacts. No individual's name or personal number.
- Complaint bodies are described by their own stated jurisdiction and limits; the site never adjudicates incidents or repeats allegations as fact.
- No new data collection. Language and city preference stay in localStorage only.
- Hindi/Marathi legal strings: request native-speaker review before merging changes (see PR notes). Marathi UI is future work gated on human translation review.

## Ownership
Single maintainer (site owner). Everything published must survive quarterly-only maintenance; anything needing weekly freshness does not belong on the site.
