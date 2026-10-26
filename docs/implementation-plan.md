# Toldit redesign implementation plan

> Execution: native implementation in isolated local branches; one independent whole-change review. User's master directive authorizes reversible decisions and continuous execution without routine approval gates.

**Goal:** upgrade the existing private OS and commercial Group site without replacing data, infrastructure, routes or integrations.
**Architecture:** preserve Vinext/D1/ChatGPT auth for OS; preserve Group's static deployment. Share token values and documented component contracts, not a new cross-project package.
**Spec:** the user's master redesign directive; `docs/research/design-references.md` and `docs/audit/baseline.md` record inspected constraints.

## Constraints
No production deployment, DNS, production migrations, paid API calls, secret inspection or invented business claims. Keep existing data and all routes. Use actual implementation captures. New credential access is limited to the source-checkout permission granted by the user.

## Review focus
1. Microphone unavailable/denied/interrupted: usable text input, correct status, no background recording.
2. Missing AI configuration: honest connection action, no fake success, preserve review-before-apply.
3. URL search/category/sort round-trips: back/forward and shared links preserve intent.
4. Inquiry encoding and empty/long input: no script injection or claim of message delivery.
5. Keyboard, reduced motion and 390/768/1440 widths: focus remains visible, no overflow or hidden navigation.

## Tasks
- [x] Baseline: existing tests/typecheck/lint/build, route and record hashes, desktop/mobile captures and local lab timings.
- [x] OS: pure briefing/Orbit state tests first; add reusable TolditOrbit, OrbitVoiceControls, voice hook and DailyBriefingPanel. Upgrade overview and AI controls; preserve current API contract and review workflow. Add semantic tokens and responsive command-centre styling.
- [x] Group: regression tests first for search URL restoration and inquiry drafts. Centralize shared navigation/footer rendering in a repeatable build script; preserve source content/product data. Add refined hero, category discovery, explicit light/dark mode and accessible inquiry composer. Self-host fonts and responsive image variants. Preserve all 60 routes and add only useful company/contact routes.
- [x] Validation: full existing/new tests, focused lint plus full lint comparison, typecheck, production/static builds, browser workflow checks at desktop/mobile/tablet, accessibility scan and bounded performance comparison.
- [x] Documentation: final deliverable status matrix, changed files/commits, remaining live-provider checks, deployment checklist and rollback procedure; package review artifacts without publishing.

## Decisions
- Existing static Group architecture wins over the older chat's initial Next.js scaffold: migration would replace working infrastructure.
- Structured AI changes stay non-streaming because the current provider contract must parse and validate a complete JSON plan. Live provider tests require separate paid-call approval. No new chat persistence or wake-word service is presented as working.
- No schema migration is required for the UI/voice upgrade. Local D1 can be initialized with existing migrations for isolated QA only.
- Do not copy inspiration-library source or imagery. Use existing Toldit concept assets and an original geometric canvas Orbit.
