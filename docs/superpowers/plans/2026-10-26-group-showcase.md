# Toldit Group redesign — finalized implementation and release plan

Finalized 27 October 2026. Execution update: the motion/image fixes and all local automated checks now pass; see [validated status](../../showcase/STATUS.md). Scope: the existing Toldit Group website only. Production publication requires the user's approval of the completed preview. Toldit OS is outside this plan.

## 1. Project and content authority — COMPLETE

- Repository: https://github.com/Toldit-SSD/Toldit-Group-LTD
- Existing website: https://tolditgroup.com/
- Existing Vercel project: `toldit-group`, ID `prj_MVv89cPzOlWwSFdutba1MoFvjTIi`, team `team_iRElp0YqMSiJcuLE3Vb2zL0L`.
- Framework: existing static HTML/CSS/JavaScript build, Node >=22. Retain this architecture; no replacement project, Next.js migration, new service or dependency.
- Working branch: `codex/group-showcase-2026-10-26`.
- Local baseline: `a59440e23f3e8f7b347506daae187889c91a759b`; rollback tag `rollback/group-before-showcase-2026-10-26`.
- Live/remote-main baseline observed on 26 October: `d7c9301c94bb5b224e5edae19b7885942e6103de`. The working checkout includes a prior unpublished redesign. This task preserves that work; it must not be confused with what is already live.
- No applicable AGENTS.md was found. The supplied reference HTML, existing assets, content templates, build and hosting configuration were inspected.

Content authority is `dist/products.js` for 55 product/venture records, `src/pages/` for page content, and the existing company/contact templates in `scripts/build.mjs`. There is no CMS, database, authentication, checkout or message-submission backend in this project. Existing contact forms prepare drafts for the existing email/WhatsApp destinations.

The before inventory is `tests/showcase-content-baseline.json`. `scripts/content-inventory.mjs` checks all 62 current routes, product data bytes, original main-content text, metadata, canonical URLs, structured data, links, form fields, image paths/alt text and 251 protected file hashes. All product details, sourcing statements, formats, status labels and existing assets stay unchanged.

## 2. Visual and interaction design — IMPLEMENTED LOCALLY

Use the supplied reference's composition and depth, with original Toldit code and media:

- Compact shared navigation; recognizable existing TOLDIT/GROUP wordmark with its existing colors.
- Dark hero with the existing headline and supporting copy as accessible HTML.
- Restrained, true perspective product ring using existing product images, without distorting packaging colors or proportions.
- A warm foreground panel visibly in front of the ring, using the existing peanut-butter/honey visual and real product links.
- A separate, semantic product list. Decorative repeated images are hidden from assistive technology.
- Mobile/touch fallback uses a normal horizontal product list; no scaled fixed canvas or locked viewport.
- Existing catalog, company, origin, venture, contact, legal and product content remains available below or through existing routes.
- Pause/resume control, reduced-motion handling, offscreen/background pause, constrained-device fallback and image-failure feedback.

Typography: retain self-hosted Manrope and its existing license; use the existing wordmark, readable responsive headings and normal body text. No generated imagery or external fonts are added.

| Semantic role | Color |
|---|---|
| Primary dark background | `#071411` |
| Secondary dark background | `#10221D` |
| Raised dark surface | `#173029` |
| Primary dark-surface text | `#F5F1E8` |
| Secondary dark-surface text | `#B9C5BD` |
| Primary gold accent | `#C5A15B` |
| Gold highlight | `#E9D8AF` |
| Supporting teal | `#5F9F94` |
| Light background | `#F4F0E7` |
| Light-surface text | `#17251F` |
| Accessible gold text on light surfaces | `#795923` |
| Light-surface focus | `#286C60` |

Tokens also cover borders, hover, active, disabled and error states. Packaging and logo assets retain their original colors.

## 3. Implementation boundaries and files

- `scripts/showcase.mjs`: build-time renderer consuming existing product objects and existing hero copy.
- `dist/showcase.js`: progressive motion, pause/state handling and image-failure recovery.
- `dist/showcase.css`: semantic colors, navigation, layered hero, responsive fallbacks and shared presentation.
- `scripts/build.mjs`: integrates the showcase and shared assets while preserving content and CSP generation.
- `dist/app.js`: null-safe existing entrance animation after the hero layout changed.
- `scripts/content-inventory.mjs`, `tests/showcase-content-baseline.json`: before/after preservation evidence.
- `dist/**/*.html`: regenerated existing pages; all 62 routes retained.

Preserve the existing search/filter/sort/pagination, product formats, enquiry drafts, consent/DNT behavior, appearance controls, SEO and security headers. No messages are sent during testing. No changes to credentials, payments, production data, DNS or audiences are included.

## 4. Validation — local automated checks COMPLETE; production approval still required

Already performed on the local implementation:

- `npm run build`: PASS, 62 generated pages.
- `npm test`: PASS, all 4 existing tests.
- `npm run check`: PASS, original routes and records, 2,098 local links/assets, sitemap, canonical URLs, image alt text, structured data/CSP and JavaScript syntax.
- `node scripts/content-inventory.mjs`: PASS, all protected content retained.
- Seven existing browser workflow groups: PASS, including catalog state/search/filter/pagination, product formats and quotation context, validated drafts with zero POST requests, light/dark persistence, menu/disclosure/Escape, all routes returning 200 and no-JavaScript fallbacks.
- Layout checks: PASS at 320, 375, 390, 768, 1024, 1280, 1440 and 1920px for the homepage and seven other page families. No page-level horizontal overflow detected.
- Foreground stacking and perspective transforms: PASS.
- Mobile outside-click/Escape/focus return, keyboard product links, image failures and landscape/zoom-equivalent reflow: PASS.
- Final checked homepage accessibility scans at 390 and 1440px: zero axe violations. Existing workflow scans also passed. This is not full WCAG certification.
- Browser console check: PASS after fixing a legacy animation selector.

Execution update: the motion-test failure has been resolved and covered by a failing-then-passing Node regression. The expanded browser suite now passes all 22 groups; six focused browser groups cover motion, the pause hit target, device/visibility fixtures and image failures. Six Node tests pass. Performance has been measured against the preceding checkout with three cold runs per viewport. Updated evidence is linked from `docs/showcase/STATUS.md`.

Real Android hardware, Safari/Firefox and true browser text zoom remain outside the verified environment. Independent review and hosted-preview delivery are tracked in the current status report. These limits do not authorize production publication.

## 5. Preview review — final captures available; hosted preview in progress

Actual desktop and mobile captures already exist in `/workspace/toldit-group-preview/`, including `desktop-preview.png`, `mobile-preview.png` and full-page captures at all eight required widths. They show the implementation, not mockups. They are review evidence, not a hosted interactive preview or a claim that final QA is complete.

After the remaining acceptance work:

1. Present final desktop/mobile previews, the content comparison, final palette/typography, test results and known content questions.
2. Provide an interactive preview on the **existing** Vercel project if permitted, explicitly targeting Preview and leaving production domains untouched. Do not create another project or use a live Sites deployment as a substitute.
3. If hosting access remains unavailable, provide the tested static bundle and screenshots with local preview instructions. Do not represent a localhost address as tablet-accessible.

Hosting limitation: the Vercel connector can read the project, but listing its deployments returned HTTP 403. No Vercel CLI is installed and no CLI credential readiness is configured. Do not claim a hosted preview exists or assume a reconnect will fix the permission. Have an authorized project/team administrator resolve the missing deployment access before using that workflow.

## 6. Content questions — preserved, not silently corrected

- All products remain marked in development; current imagery includes illustrative/AI-generated packaging concepts. It is not evidence of finished goods, confirmed stock or final packaging.
- Existing origin statements identify specific South Sudan locations. Preserve them exactly; company confirmation is still required for their accuracy.
- Existing email and WhatsApp destinations are retained; ownership/deliverability was not verified by sending an enquiry.
- The local checkout contains prior unpublished copy, company/contact pages and navigation improvements that differ from the live site's older revision. This redesign retains them and makes the publication difference explicit.
- No new prices, currency conventions, reviews, certifications, offers or manufacturing claims are introduced.

## 7. Production deployment and rollback — NOT STARTED

Production requires the user's explicit approval of the final preview. Approval is the final release gate, after the reviewable work and validation above.

Once approved:

1. Record the approved commit and preview evidence. Confirm the same Vercel team/project, production branch and existing domains. Recheck remote changes before merging; preserve any newer work.
2. Record the currently active production deployment ID and retain its artifact. The previously observed production ID was `dpl_BqnXKU41SAktJT1FNCyMswmdnm21`; refresh this at release time.
3. Release the reviewed static artifact through the existing workflow. Do not change DNS, create projects, migrate data or introduce paid services. If production requires a rebuild, validate that build before promotion.
4. Check the homepage, catalog/search, representative product/category pages, contact-draft flow, legal page, metadata, images and console on the released site, without sending real enquiries.
5. If a regression appears, restore the recorded previous production deployment. The local rollback tag restores the previous **unpublished checkout**, not necessarily the live version; do not confuse these rollback targets.

Completion means the reviewed preview is approved, the exact release passes checks, all required content is retained, and the deployment result is verified. Until then, the live site stays unchanged.
