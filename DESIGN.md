# Jan Adhikar design system

Jan Adhikar is a mobile-first civic safety tool. The interface must help a person under stress identify the correct next action in seconds.

## Product rules

1. Safety and human help come before documentation or complaints.
2. The first screen presents exactly four pathways, in a fixed order.
3. Legal detail stays behind clear disclosure controls until requested.
4. No interface may imply that Jan Adhikar dispatches help, assigns a lawyer, files a case or receives evidence.
5. The page remains usable without remote fonts, images, frameworks, analytics or third-party scripts.

## Visual system

- Canvas: warm off-white `#F6F3EB`.
- Primary surface: `#FFFDF8`.
- Main text: deep civic green-black `#13211D`.
- Muted text: `#4F5E58`, maintaining WCAG AA contrast on the canvas.
- Primary action: deep green `#103A32`.
- Emergency action: restrained red `#992B2B`.
- Focus indicator: blue `#0874B9`, 3px with a visible offset.
- Borders: `#CCD2C9`; stronger interactive borders: `#AEB8AF`.
- Corner radii: 8px for controls, 12px for action rows, 16px for major containers.
- Shadows are shallow and functional. They distinguish tappable rows from the canvas without decorative elevation.

## Typography

- Body and Hindi: the device's native UI typeface for speed, legibility and zero network cost.
- English display headings: Georgia with conservative sizing and tight line-height.
- Body text is at least 16px. Secondary labels are at least 12px and remain high contrast.
- Hindi headings use the native UI typeface, heavier weight and neutral letter spacing.

## Interaction

- Touch targets are at least 44×44px.
- Every interactive element has hover, pressed and keyboard-focus states.
- Primary pathways expose `aria-expanded` and return keyboard focus to their trigger when closed.
- Motion is limited to short state feedback and is removed when `prefers-reduced-motion` is enabled.
- The emergency call action lives in the header instead of a fixed bottom bar, so it never covers content on short screens.

## City scoping

- One optional decision: three chips (Delhi, Mumbai, Elsewhere in India) at the end of the hero. National actions (112, 15100) are never city-scoped.
- The static HTML default is the national view; city content appears only after an explicit tap (stored locally, applied on return visits). No location permission, ever.
- Every city-scoped call card carries its city in the label ("Ambulance — Delhi (CATS)"), so screenshots cannot misroute readers in another city.
- `data-city-scope` attributes drive visibility; all variants ship in the HTML so offline use is unaffected.

## Print

- Screen sections are hidden in print; a dedicated `.print-card` section prints instead, containing the bilingual essentials (all cities). "Print this page" must always produce a usable paper card with phone numbers.

## Responsive behavior

- Primary test widths: 320px, 360px, 390px and 430px.
- On short portrait screens, pathway descriptions hide while labels remain, keeping all four choices within reach.
- On landscape screens, pathways can use two columns when space permits.
- Safe-area insets protect header, footer, status messages and controls on notched devices.
- Long Hindi strings, email addresses and telephone numbers must wrap without horizontal overflow.
