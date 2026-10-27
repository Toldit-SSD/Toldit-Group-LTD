# Toldit Group LTD

The product-showcase redesign and motion/error fixes are documented in [the current validation report](docs/showcase/STATUS.md). The existing static architecture, product records and routes are preserved. Production publication requires approval of the final preview.

The existing commercial website, upgraded on its original static infrastructure. All 55 product/venture records and 60 original routes are preserved. The build adds company and contact pages, responsive shared navigation/footer, a searchable catalog, light/dark appearance and honest enquiry drafts.

The earlier Next.js scaffold request was superseded by the master directive to preserve and upgrade existing infrastructure. This repository remains static HTML/CSS/JavaScript; Toldit OS retains its existing Next-compatible TypeScript application. There is no invented administration backend or authentication system here.

## Structure

- `dist/`: deployable site, including the authored browser scripts and preserved assets.
- `dist/products.js`: existing authoritative product/venture records; unchanged by the redesign.
- `src/pages/`: original page-content templates. Edit existing content here, then rebuild. Generated company/contact template content is authored in `scripts/build.mjs`.
- `scripts/components.mjs`: shared navigation, footer, product card and enquiry form renderers.
- `scripts/build.mjs`: generates 62 pages, preserves canonicals, updates sitemap additions and recalculates CSP hashes.
- `scripts/optimize-images.mjs`: creates responsive WebP variants from supplied original images; originals stay intact.
- `scripts/check.mjs`, `tests/`: route/link/metadata/CSP checks plus record, search and enquiry validation tests.
- `dist/design.css`, `dist/fonts/`, `DESIGN.md`: semantic tokens, responsive styles, local OFL typography.
- `dist/{catalog-core,inquiry-core,site,theme,contact}.js`: catalog URL state, draft validation, accessible menu and appearance controls.
- `vercel.json`: preserved static hosting configuration; no automatic production publication performed.

## Develop and verify

Node >=22. Run `npm ci` when regenerating images, then `npm run images`. Committed variants mean normal page builds need no image processing: `npm run build`, `npm test`, `npm run check`.

Serve `dist` using a local HTTP server. Root-relative URLs require an origin-root server, not opening an HTML file directly. Local tests used Chromium and applied the actual Vercel CSP/security headers. No new deployment URL exists yet.

Edit content templates and shared components, then rebuild; do not hand-edit generated page headers/footers. Keep `dist/products.js` as the source for confirmed catalog edits and update regression expectations deliberately. `tests/baseline-manifest.json` records the original routes and product-file hash for preservation checks.

## Enquiries and privacy

The form validates input and prepares email/WhatsApp drafts using the repository's existing contact destinations. It sends nothing, stores no enquiry and has no server endpoint. Users review and send in their chosen app. No CAPTCHA, paid delivery service or invented success receipt is added. Existing optional analytics consent, privacy route and DNT handling remain unchanged. Do not include personal enquiry fields in analytics.

Products remain **in development**. Existing concept imagery is labelled; final availability, prices, packaging and commercial terms are unconfirmed. Origin claims and contact ownership require the company's confirmation before publication.

See [research](docs/design-references.md), [baseline audit](docs/baseline-audit.md), [release report](docs/RELEASE.md) and [design system](DESIGN.md). Production deployment needs explicit user approval.
