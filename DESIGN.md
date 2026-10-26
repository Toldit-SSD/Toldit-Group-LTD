# Toldit Group design system

Consumer products and commercial enquiries, rooted in the existing South Sudan / East Africa ambition. Warm paper surfaces and a deep green-charcoal hero support supplied product concepts. Restrained gold actions and cyan focus provide a family resemblance to Toldit OS without turning the commercial site into an AI dashboard.

## Tokens

Implementation: `dist/design.css`, layered after preserved layout styles.

| Role | Light | Dark |
|---|---|---|
| Surface | `#f5f3ed` | `#111713` |
| Raised panel | `#fffef9` | `#1c241e` |
| Text | `#1c2923` | `#f0f1e9` |
| Secondary text | `#5c675e` | `#b3beb4` |
| Border | `#ced3c9` | `#465248` |
| Gold | `#86622d` | `#e0bb7d` |
| Cyan focus | `#176673` | `#84d3da` |

Hero/footer use `#15211b` with `#e0bb7d` accents. Font: self-hosted Manrope variable (OFL included), Arial fallback. Hero type 43–72px; responsive section type 30–48px. Gutter 20–88px; section spacing 56–112px; 6px radii; controls at least 44px high. Product card grids: four, three or two columns as space permits.

## Components

`navigation()` renders a native product disclosure, meaningful category links, active-route indication and mobile Menu button. Escape closes the expanded disclosure first, then the menu; outside focus/click closes it. `footer()` provides a reusable product/company/contact/legal hierarchy. `productCard()` uses real catalog entries, labelled concept images and responsive image variants. The hero has a primary catalog action and secondary distribution action.

The enquiry form has visible labels, bounded input, per-field errors, status feedback and encoded draft links. It never claims submission. Search/category/sort persist in the URL and restore on reload/back/forward. No-JavaScript visitors retain product links, a full collections page and direct contact methods. Saved light/dark appearance is explicit; the default is brand-appropriate light.

## States and motion

No-result search includes a reset action. Native product FAQs and menu disclosures remain keyboard-operable. Cyan focus outlines, skip link and semantic landmarks support navigation. Restrained reveal/hover motion respects reduced motion; content is visible before any animation. Local image variants avoid oversized downloads. Image alt text states when imagery is conceptual.

## Content and licenses

Preserve original factual content and flag unverified origins. No prices, stock, certification, reviews or manufacturing promises are invented. The seven reference sites inform patterns; none of their protected screenshots/code/assets were copied. Existing Toldit imagery remains subject to its original provenance. The only added external asset is OFL Manrope with its license.
