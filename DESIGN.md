# Adhikar Sathi design system

Adhikar Sathi is a mobile-first civic safety tool. The interface must help a person under stress identify the correct next action in seconds.

## Product rules

1. Safety and human help come before documentation or complaints.
2. The first screen presents exactly four pathways, in a fixed order, and all four must be visible without scrolling on a 320×568 screen.
3. Legal detail stays behind clear disclosure controls until requested.
4. No interface may imply that Adhikar Sathi dispatches help, assigns a lawyer, files a case or receives evidence.
5. The page remains usable without remote fonts, images, frameworks, analytics or third-party scripts.

## Visual system

The language is **"signal plates on paper"**: the visual vocabulary of Indian public wayfinding — platform numerals, black-on-yellow signal plates, emergency red, ruled civic documents — set calmly on warm paper. It is deliberately not a generic product aesthetic; every device exists because it is glanceable under stress. Two automatic schemes share one token vocabulary (`styles.css` `:root` plus a `prefers-color-scheme: dark` override). Every text/surface pair meets WCAG AA (4.5:1 text, 3:1 UI boundaries) in both schemes; pairs are verified computationally before any palette change ships.

- Ground: warm ivory `--paper` `#FAF7F0` / warm black `#121110`; white/`#1B1916` cards; warm ink `--ink` `#171511`/`#F2EFE7`; `--muted` `#5E584A`/`#A49D8E`.
- Exactly two colors, each with one meaning. **Signal yellow** `--signal` (`#F2B90D`/`#F0B429`) marks identity and highlight moments: the hero kicker plate, the selected city chip, the primary (non-emergency) call card, the "say this" script, and the closing card band. Yellow appears only as an ink-bordered plate with ink text — never as tinted pastel or colored text on light ground. **Emergency red** `--danger` (`#C23430`/`#C63E38`) belongs to 112 alone: the header button, route 1's numeral plate, the danger panel rule, every `tel:112` card.
- The four routes are one signboard: a single ink-bordered board with ruled rows, like a station direction board. Each row carries a 44px square numeral plate — route 1 reversed on red, routes 2–4 ink-bordered — with 800-weight tabular digits and a → arrow. The active row shows a 3px inset ink bar, and every help panel opens with the same numeral plate beside its kicker, so the number a person pressed visibly continues into the answer.
- Card physics: `1.5px` visible borders (`--line-bold`, ≥3:1) with a hard offset shadow (`--press`); pressing translates the card down 2px and collapses the shadow, like pushing a printed card. Hairlines (`--line`) only for inner grouping.
- Structure rules are 2px solid ink: header bottom, after-safe divider, footer top — the document grid.
- The closing "save the essentials" band **is** the emergency card: signal yellow, ink border, ink-filled primary button. In dark mode it stays yellow — illuminated signage at night.
- Links are ink with underlines (document convention); primary buttons are ink plates in light mode and paper plates in dark mode; red buttons are unchanged in both.
- Form-field borders (`--field-border`) hold ≥3:1 against the field background.
- Focus: 3px ink ring (paper-white in dark), offset 2px; the yellow band overrides the ring to ink so it never drops below 3:1.
- Corner radii: 6px controls, 8px numeral plates, 10px rows, 12px panels/band. No blur, no gradients, no glow — flat warm surfaces and crisp edges.
- `color-scheme` metadata keeps native controls, scrollbars and the browser chrome (`theme-color`, one value per scheme) in step. The favicon is the mark: black अ on an ink-bordered signal-yellow plate; the same plate sits in the header brand.

## Typography

- Everything is set in the device's native UI typeface (SF Pro / Roboto / Segoe) for speed, legibility and zero network cost — no remote or bundled fonts, ever. Character comes from weight contrast, not typeface count: 800 numerals, 750 display, 700 labels, 400 body.
- Display headings are weight 750 with tight tracking (h1 −.02em). The scale stays calm — h1 `clamp(1.75rem … 2.6rem)`, h2 `clamp(1.3rem … 1.65rem)` — so the four pathways, not the headline, dominate the first screen. Kickers are 11px caps at .12em tracking, plate-mounted in the hero.
- Hindi headings are weight 700, line-height 1.3, letter-spacing 0 (negative Latin tracking is never applied to Devanagari); Hindi body line-height is 1.65 so matras never clip. Uppercase kickers reduce letter-spacing in Hindi.
- The hero pairs languages like an Indian station board: beneath the headline question, the same question appears in the other language (with a correct `lang` attribute), so a reader of either script orients instantly. The paired line yields on very short screens.
- Body text is at least 16px. Secondary labels are at least 12px and remain high contrast. Telephone numbers and route numerals are tabular figures at weight 800.

## Interaction

- Touch targets are at least 44×44px, `touch-action: manipulation` throughout; the toast never intercepts taps (`pointer-events: none`, bottom-center).
- Every interactive element has hover, pressed and keyboard-focus states; transitions are 90–150ms and are suppressed on first paint (`body.ready` gate) and under `prefers-reduced-motion`.
- Call cards carry a phone glyph (inline SVG mask, `currentColor`) so a tappable number reads as "this dials". The selected city chip carries a check glyph so state never relies on color alone.
- All disclosure controls share one affordance: a rotating chevron on `summary` (WebKit default markers suppressed).
- Primary pathways expose `aria-expanded`, Escape closes an open panel, and keyboard focus returns to the trigger.
- The emergency call action lives in the header instead of a fixed bottom bar, so it never covers content on short screens.

## City scoping

- One optional decision: three chips (Delhi, Mumbai, Elsewhere in India) at the end of the hero. National actions (112, 15100) are never city-scoped.
- The static HTML default is the national view; city content appears only after an explicit tap (stored locally, applied on return visits). No location permission, ever.
- Every city-scoped call card carries its city in the label ("Ambulance — Delhi (CATS)"), so screenshots cannot misroute readers in another city.
- `data-city-scope` attributes drive visibility; all variants ship in the HTML so offline use is unaffected.

## Print

- Screen sections are hidden in print; a dedicated `.print-card` section prints instead, containing the bilingual essentials (all cities). "Print this page" must always produce a usable paper card with phone numbers.

## Responsive behavior

- Primary test widths: 320px, 360px, 390px and 430px, plus landscape and desktop.
- The hero is compact by design: label-above chips on mobile, a single reassurance line, no oversized headline. On short portrait screens (≤650px tall) pathway descriptions, the paired-language line and the city note hide while labels remain, keeping all four choices within reach.
- On landscape screens, pathways use two columns when space permits.
- Safe-area insets protect header, footer, status messages and controls on notched devices.
- Long Hindi strings, email addresses and telephone numbers must wrap without horizontal overflow at every width above.
