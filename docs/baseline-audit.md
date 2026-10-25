# Baseline audit

## Sources and isolation
- OS: existing private Sites repository, baseline `2519bc9683ff8b11e83c8739cf889f813fea3c32`, saved Site version 9. GitHub `Toldit-SSD/TolditOS` contains only a README and is not the deployed application source.
- Group: GitHub `Toldit-SSD/Toldit-Group-LTD`, baseline `d7c9301c94bb5b224e5edae19b7885942e6103de`; a separate older Sites version 2 also exists. GitHub is the current commercial-site source.
- Both clean checkouts have `codex/redesign-2026-10-25` and `rollback/pre-redesign-2026-10-25`. Full baseline Git bundles retained outside checkouts in `/workspace/toldit-audit/`.
- No uncommitted user changes were present. Earlier chat-generated local files were absent from this new environment; recovered text was archived separately.

## OS architecture and workflows
Next.js-compatible App Router on Vinext/Vite, React 19, TypeScript, Tailwind 4, Cloudflare Worker, D1/Drizzle. Retain the lockfile, Sites build plugin and `.openai/hosting.json` identity/binding.

Root route requires dispatch-owned ChatGPT identity. Existing screens: Overview, Businesses (products/finances), Idea vault, AI adviser, More, Import inbox, Tasks, Documents, Change history, Agent activity, Settings. API endpoints: records, catalog, source, history, agents, hermes, ai/connection. Reserved platform sign-in/out/callback routes remain platform-owned.

Database: records, history with audit triggers, agent_runs, ai_connections. User data includes per-owner records plus legacy private-workspace records. Preserve this owner-private access model; expanding audience requires a separate authorization audit. No production database inspected or changed.

AI: server-side OpenAI chat completions, encrypted per-owner credentials, optional operator key, separate HTTPS Hermes endpoint/key/model. Plans are validated and require user review before saving. Responses currently use non-streaming structured JSON. Provider configuration names: OPENAI_API_KEY, OPENAI_MODEL, AI_CREDENTIAL_ENCRYPTION_KEY, HERMES_API_KEY, HERMES_API_BASE_URL, HERMES_MODEL. Runtime values were not read. Live billing and Hermes health remain unverified.

Findings: decorative homepage Orbit has no action/voice states; home navigation is spread across a bottom bar; headline/briefing duplicates; source files are heavily compressed; conversation history is not persisted. Native dictation and speech synthesis can improve interaction without a paid voice service. Keep unavailable voice and AI states explicit. Large UI dependency set includes many vendored primitives; do not remove without usage evidence.

Baseline checks: 7 existing AI credential/provider tests passed. SQLite audit/history ownership and conflict tests passed. Typecheck, lint, build and browser baseline are recorded separately as executed.

## Group architecture and workflows
Static HTML/CSS/JavaScript with `dist` as Vercel output; no package manifest, server, database, authentication or administration dashboard in the current repository. 60 HTML routes and 55 product/venture records. Search supports aliases, category, sorting and incremental results. Individual product URLs, packaging selectors, email and WhatsApp drafts, analytics opt-in and privacy route exist.

Preserve all product IDs, records, paths, canonical URLs, sitemap entries, Google verification and existing contact destinations. Existing product images are illustrative concepts, including AI-generated renders, not proof of final packaging. All products are in development. Existing origin claims must be retained with a content-review flag, not newly certified by this audit.

Findings: duplicated global navigation/footer across HTML; homepage only shows products with JavaScript; search text is not retained in the URL; external CSS font import; inconsistent navigation depth and active-route indication; no structured inquiry composer. No actual checkout, order processing or message backend. Do not fabricate those services.

Vercel project `toldit-group` was discoverable but deployment-history access returned 403; no Vercel CLI is installed. Deployment health remains unverified. The existing public domain in repository metadata is `https://tolditgroup.com/`; DNS will not be changed.
