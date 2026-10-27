# Toldit Group design system

Consumer products and commercial enquiries, rooted in the existing South Sudan / East Africa ambition. Forest, warm paper and restrained gold extend Toldit's existing packaging palette. The TOLDIT/GROUP wordmark retains its typography, sizing, spacing and theme colors. Existing packaging imagery and its colors remain intact.

## Tokens

Implementation: `dist/showcase.css`, layered after preserved layout styles and `dist/design.css`. The latter supplies local Manrope and shared component foundations; the showcase layer supplies the current semantic palette and presentation.

| Role | Light | Dark |
|---|---|---|
| Surface | `#f4f0e7` | `#10221d` |
| Raised panel | `#fcfaf4` | `#173029` |
| Text | `#17251f` | `#f5f1e8` |
| Secondary text | `#58665d` | `#b9c5bd` |
| Border | `#cdd1c6` | `#496056` |
| Gold | `#795923` | `#e9d8af` |
| Focus | `#286c60` | `#b6d7ca` |
| Interaction hover | `#e6decd` | `#234238` |
| Interaction active | `#173029` | `#c5a15b` |
| Interaction disabled | `#7d897f` | `#81978a` |
| Error token | `#a92d24` | `#ffb5a7` |
| Wordmark ink | `#1c2923` | `#f0f1e9` |

Brand primitives: forest `#071411`, secondary forest `#10221d`, raised forest `#173029`, ivory `#f5f1e8`, sage `#b9c5bd`, champagne `#c5a15b`, champagne highlight `#e9d8af` and teal `#5f9f94`. Hero/footer use forest; hero focus uses champagne highlight. The overlapping food panel stays paper with dark ink in both themes. The legacy `--cyan` name aliases the current focus token.

Font: self-hosted Manrope variable, weights 200–800, with `font-display: swap` and Arial/sans-serif fallbacks; OFL included. Showcase hero type is 48–86px on large screens, with breakpoint adjustments down to 36px on small screens; section type is 30–48px. Gutter is `clamp(20px, 5vw, 96px)`; section spacing is 56–112px, or 54px below 600px. Base radius is 12px, with explicit component radii from 6–18px. Controls are at least 44px high; primary buttons are at least 48px. Product card grids use four, three or two columns as space permits.

## Components

`navigation()` renders a native product disclosure, meaningful category links, active-route indication and mobile Menu button inside a rounded sticky shell. Escape closes the expanded disclosure first, then the menu; outside focus/click closes it. `footer()` provides a reusable product/company/contact/legal hierarchy. `productCard()` uses real catalog entries, labelled concept images and responsive image variants.

The centered desktop hero has a primary catalog action and secondary distribution action. Eight existing products repeat only in an `aria-hidden` decorative ring; a separate semantic list provides unique product links. The paper food panel overlaps the ring and contains existing honey/peanut imagery and real product links. At 900px and below, or with a coarse pointer, the ring is replaced by a static, horizontally scrollable product list. Below 600px the headline is left-aligned and the food panel stacks vertically.

The enquiry form has visible labels, bounded input, per-field errors, status feedback and encoded draft links. It never claims submission. Search/category/sort persist in the URL and restore on reload/back/forward. No-JavaScript visitors retain product links, a full collections page and direct contact methods. Saved light/dark appearance is explicit; the default is brand-appropriate light.

## States and motion

No-result search includes a reset action. Native product FAQs and menu disclosures remain keyboard-operable. Theme-aware focus outlines, skip link and semantic landmarks support navigation. Content is visible before any animation. Local image variants avoid oversized downloads. Image alt text or adjacent captions identify conceptual imagery. Supported image holders show an explicit unavailable message on failure; original product images without such a holder retain their native alt fallback.

`dist/showcase.js` animates the decorative desktop ring only when 3D transforms are supported, the pointer/layout permits it, reduced motion is off and device capacity permits it. Transform updates are capped at about 30fps. The pause/resume button sits above the ring, clear of the overlapping food panel; manual pause persists across media and visibility changes during the visit. Animation stops offscreen, in a hidden document and on page hide. The frame loop synchronizes the control and reported state if it observes a state change before the corresponding event arrives.

Reduced motion, data-saving mode, or reported CPU/memory capacity of four cores/GB or fewer keeps the desktop composition static and hides the motion control. Compact/coarse-pointer layouts use the semantic product list. Reduced motion also disables smooth scrolling and decorative transitions. The separate product links, catalog and enquiry paths remain available with motion paused or JavaScript disabled.

## Content and licenses

Preserve original factual content and flag unverified origins. No prices, stock, certification, reviews or manufacturing promises are invented. Reference sites and the supplied perspective-ring example inform patterns; their protected screenshots/code/assets were not copied. Existing Toldit imagery remains subject to its original provenance. The showcase adds no external assets or dependencies; the earlier local redesign includes OFL Manrope with its license.

Current direction and bounded validation are recorded in `docs/showcase/DIRECTION.md` and `docs/showcase/STATUS.md`. The preview preserves 55 catalog records, 62 routes and 251 protected source/media hashes. Production publication remains a separate approval step.
