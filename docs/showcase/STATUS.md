# Toldit Group showcase — validated preview candidate

Updated 27 October 2026. Work is confined to the existing Toldit Group repository and isolated branch `codex/group-showcase-2026-10-26`. Toldit OS, production data, DNS and production deployment are unchanged.

## Fixes

- The animation frame loop now synchronizes the pause control and motion state when a media/visibility change is observed before its event callback arrives. The regression test failed with `running` instead of `paused` before the fix and now passes. CSS also hides the control immediately under reduced motion.
- The pause control is placed above the product ring, clear of the overlapping foreground panel. Browser hit tests and clicks pass at 901, 920, 1024, 1280, 1440 and 1920px.
- Failed images are hidden only where a supported replacement message exists. Existing product-page imagery keeps its native alt fallback; the browser regression failed before the fix and passes afterward.
- The existing entrance-animation helper tolerates the replaced hero element. Responsive asset URLs are no longer optimized a second time.
- The analytics-settings link uses sufficient contrast on the dark homepage.

## Validation

| Check | Result |
|---|---|
| Static build | PASS: 62 pages |
| Node tests | PASS: 6/6 |
| Static link/SEO/CSP/syntax checks | PASS: 2,098 local references, original routes, sitemap, canonicals, JSON-LD and alt attributes |
| Content preservation | PASS: 55 exact records, 62 routes, original text/metadata/links/forms/images and 251 protected hashes |
| Expanded browser suite | PASS: 22/22 groups |
| Existing critical workflows | PASS: 7/7 groups |
| Focused motion/image regressions | PASS: 6/6 groups |
| axe checks | Zero violations in checked homepage desktop/mobile and existing product/contact light/dark views |

Responsive widths: 320, 375, 390, 768, 1024, 1280, 1440 and 1920px; homepage plus collections, company, contact, honey, home-care, food-origin and privacy page families. Tested navigation, search/filter/sort/pagination, quotation/product-format context, validation, encoded email/WhatsApp drafts, themes, keyboard and menu closure, no-JavaScript fallbacks, foreground stacking, image failures and console errors. Forms sent zero POST requests.

Device capacity and document-visibility boundary tests use explicit browser fixtures. Real Android hardware, Safari/Firefox and operating-system text zoom are not certified. The 640px reflow check is a zoom-equivalent layout check, not a real browser text-zoom measurement. Accessibility automation is not a complete WCAG conformance audit.

Results: [browser](browser-results.json), [motion](motion-results.json), [workflows](workflow-results.json), [performance](performance-results.json).

## Performance comparison

Local Chromium, cold contexts, 4× CPU slowdown, 1.6Mbps download/750Kbps upload, 40ms latency, reduced motion, three runs per version/viewport. Baseline is the preceding unpublished checkout `a59440e`, served as static output. Values below are medians. No field INP or production CDN measurements are claimed.

| Metric | Desktop before → after | Mobile before → after |
|---|---|---|
| LCP | 1.364s → 1.284s | 1.220s → 1.264s |
| CLS | 0.0024 → 0.0278 | 0.0770 → 0.0006 |
| Resource transfer, excluding HTML | 351,637 → 380,859 bytes | 246,631 → 300,457 bytes |
| JavaScript body bytes | 38,340 → 42,677 | 38,340 → 42,677 |

The showcase adds imagery and a 4.3KB browser module. The observed LCP/CLS remain within the requested targets; the mobile transfer increase is recorded rather than hidden.

## Content questions intentionally unchanged

All products remain in development; supplied imagery includes illustrative/AI-generated concepts. Existing origin claims and contact destinations remain unchanged and require company confirmation for accuracy/ownership. No prices, availability, certifications, testimonials, payments or manufacturing capacity were invented. No live enquiry was sent. The local source contains the preceding unpublished company/contact/navigation work, which differs from the older production site.

## Preview and release

Actual settled desktop/mobile captures and full-page evidence are in `/workspace/toldit-group-preview/`. Hosted preview publication is a separate **Preview** deployment of the existing Vercel project; production approval is still required. Deployment details will be recorded after the provider returns a verified result.

Rollback before release: `rollback/group-before-showcase-2026-10-26` restores the preceding local checkout. For any approved production release, first record the active production deployment and roll back to that deployment if needed. The local tag and live production baseline are different. Do not change domains or database state.
