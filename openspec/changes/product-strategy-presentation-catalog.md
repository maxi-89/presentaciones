# Product Strategy: Presentation Catalog Platform
_Saved by product-strategy-analyst · 2026-05-16_

> Full planning document: `docs/product-plan-presentation-catalog.md`

## Executive Summary

Self-hosted speaker portfolio and live presentation platform built on Next.js. Replaces the current pattern of local HTML files with a public-facing catalog where the author can present from any browser, share permanent URLs per talk, and offer PDF/PPT downloads to attendees.

## Use Cases Identified

1. **Live Presentation Mode** — present from any browser, full-screen, keyboard-navigable
2. **Post-Talk Slide Sharing** — permanent URL per talk for audience access
3. **Speaker Portfolio Discovery** — catalog as professional portfolio for organizers/recruiters
4. **Download for Offline Use** — PDF and PPT export per presentation
5. **Self-Publishing New Talks** — admin UI to upload HTML + fill metadata

## Target User Personas

- **Speaker (Primary):** Author of the talks — needs device-agnostic presenting, sharing, and portfolio
- **Attendee (Secondary):** Follows a link shared after a talk — needs slides online and downloadable
- **Organizer/Recruiter (Tertiary):** Discovers catalog via search — needs professional portfolio view

## Value Proposition

Full-control, self-hosted alternative to SlideShare/Speaker Deck that natively supports custom HTML presentations, preserves branding, and adds PDF/PPT export without SaaS dependency.

## Key Risks & Assumptions

- HTML presentations must be self-contained (no relative local paths) — needs audit
- Playwright must run in deployment environment — verify for Vercel/VPS target
- PPT export will be image-based (not editable shapes) — must be documented to manage expectations
- Admin auth scoped to single user only (no multi-user)

## Recommended Next Steps

1. Audit existing HTML presentations for asset path issues
2. Execute Slice 0 (Foundation) → Slice 1 (Catalog) → Slice 2 (Viewer) → Slice 3 (PDF)
3. Deploy after Slice 3 to get a real public URL
4. Execute Slice 5 (Admin) to enable self-publishing
5. Slice 4 (PPT) and Slice 6 (Discovery) as polish
