# SlideHub — Presentation Catalog Platform
**Product Strategy & Implementation Plan**
_Product Strategy Analyst · 2026-05-16_

---

## Executive Summary

Personal tool to manage HTML-based presentations as a self-hosted public catalog. The author can browse all talks, present directly from any browser (no local file needed), share a permanent URL per talk, and let attendees download a PDF.

Scope is intentionally minimal: no admin UI, no search, no analytics. New talks are published by dropping an HTML file and editing the JSON data file directly.

---

## Problem Space

| Pain | Current workaround | Cost |
|------|-------------------|------|
| Presentations only live on a local machine | Copy files manually before each talk | Risk of having the wrong version at the venue |
| Sharing slides requires email/Slack/Drive | Ad-hoc links, inconsistent | Audience friction |
| No PDF download for attendees | Manual export per talk | Time-consuming |
| Presenting from the browser isn't possible today | Must use local file | Single point of failure if laptop fails |

---

## Use Cases

### UC-01 · Live Presentation Mode
**Scenario:** The speaker arrives at a venue with an unfamiliar laptop or wants to use a secondary device.
**Solution:** Open the catalog on any browser, click "Present" — slide renders full-screen 16:9 with keyboard navigation.
**Outcome:** Portable, device-agnostic presenting experience.

### UC-02 · Post-Talk Slide Sharing
**Scenario:** After a talk, the audience asks "where can I get the slides?"
**Solution:** Each presentation has a permanent public URL. Audience can browse online and download PDF.
**Outcome:** Single shareable link per talk.

### UC-03 · Download for Offline Use
**Scenario:** An attendee wants to review slides later without internet.
**Solution:** "Download PDF" button on each presentation page.
**Outcome:** Attendees have persistent reference material.

---

## Target Users

- **Author (primary):** Maxi — presents from venues, shares slides with audiences, manages the catalog by editing JSON directly.
- **Attendee (secondary):** Follows a URL, browses online, downloads PDF.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App (App Router)               │
│                                                             │
│  ┌─────────────┐  ┌──────────────────────────────────────┐  │
│  │  Catalog    │  │  Viewer                              │  │
│  │  /          │  │  /[slug]          (detail + iframe)  │  │
│  │             │  │  /[slug]/present  (full-screen)      │  │
│  └─────────────┘  └──────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes                                          │   │
│  │  /api/export/pdf/[slug]   GET → download PDF         │   │
│  │  /api/export/ppt/[slug]   GET → download PPTX        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────┐       ┌──────────────────────┐
│  /public/       │       │  Playwright           │
│  presentations/ │       │  (PDF + screenshots)  │
│  *.html         │       │                      │
│  thumbnails/    │       │  pptxgenjs            │
│  exports/       │       │  (PPTX generation)    │
└─────────────────┘       └──────────────────────┘
         │
         ▼
┌─────────────────┐
│  data/          │
│  presentations  │
│  .json          │
│  (edited by     │
│   hand)         │
└─────────────────┘
```

**Tech Stack:**
- **Framework:** Next.js 15 App Router + TypeScript (strict)
- **Styling:** Tailwind CSS
- **Data storage:** `data/presentations.json` — edited manually when adding a talk
- **PDF export:** Playwright (headless browser, pixel-perfect capture of HTML)
- **PPT export:** `pptxgenjs` + Playwright screenshots (image-based slides)
- **Deployment:** Vercel or VPS

---

## Slice Plan

Slices are ordered by value delivered. Each slice is independently shippable.

---

### Slice 0 — Foundation Setup
**Goal:** Working Next.js project with design system and data layer.
**Why first:** Every subsequent slice depends on this.

**Tasks:**
- [ ] `S0.1` — Initialize Next.js 15 project with TypeScript strict + Tailwind CSS
- [ ] `S0.2` — Define `Presentation` TypeScript type and JSON schema
- [ ] `S0.3` — Create `lib/data/presentations.ts` — reads/writes `data/presentations.json`
- [ ] `S0.4` — Seed `data/presentations.json` with the existing `jornadaTecnologia` talk
- [ ] `S0.5` — Copy existing HTML presentations to `public/presentations/`
- [ ] `S0.6` — Set up root layout (`app/layout.tsx`) with nav and footer shell
- [ ] `S0.7` — Configure Tailwind design tokens (colors, fonts matching presentation aesthetic)

**Acceptance criteria:** `npm run dev` shows a blank page with nav. JSON is readable and typed.

---

### Slice 1 — Catalog Page (MVP Core)
**Goal:** Home page showing all presentations as cards.

**Tasks:**
- [ ] `S1.1` — Build `PresentationCard` component (title, event, date, thumbnail)
- [ ] `S1.2` — Build `app/page.tsx` — Server Component, reads all presentations, renders grid
- [ ] `S1.3` — Auto-generate thumbnail via Playwright screenshot at build time → save to `public/thumbnails/`
- [ ] `S1.4` — Empty state when no presentations exist

**Acceptance criteria:** Catalog shows at least 1 card with thumbnail.

---

### Slice 2 — Presentation Detail & Viewer
**Goal:** Each presentation has its own page with an embedded viewer and a full-screen presenter mode.

**Tasks:**
- [ ] `S2.1` — Build `app/[slug]/page.tsx` — shows title, event, date, action buttons (Present, Download PDF, Download PPT)
- [ ] `S2.2` — Embed the HTML presentation in an `<iframe>`
- [ ] `S2.3` — "Present" button → opens `app/[slug]/present/page.tsx` — iframe fills viewport, no chrome
- [ ] `S2.4` — Escape key exits full-screen presenter back to detail
- [ ] `S2.5` — 404 page for unknown slugs (`not-found.tsx`)

**Acceptance criteria:** Clicking a card opens its detail. "Present" goes full-screen. Escape exits.

---

### Slice 3 — PDF Export
**Goal:** "Download PDF" generates a pixel-perfect PDF of the presentation using a headless browser.

**Tasks:**
- [ ] `S3.1` — Install Playwright as a server-side dependency
- [ ] `S3.2` — Build `app/api/export/pdf/[slug]/route.ts` — launches Playwright, iterates slides, captures each to a PDF page
- [ ] `S3.3` — Set correct Content-Type and Content-Disposition headers for download
- [ ] `S3.4` — Add progress/loading state to the "Download PDF" button (client component)
- [ ] `S3.5` — Cache generated PDFs in `/public/exports/pdf/` to avoid re-generation on every request
- [ ] `S3.6` — Add cache invalidation hook: when a presentation is updated, delete its cached PDF

**Acceptance criteria:** Clicking "Download PDF" starts a download. The PDF preserves layout, fonts, and colors from the HTML presentation.

---

### Slice 4 — PPT Export
**Goal:** "Download PPT" generates a PowerPoint file from the presentation slides.
**Note:** This slice has the highest technical risk. PPT cannot perfectly represent custom CSS/HTML. The approach is to screenshot each slide and embed as images in the PPTX — acceptable fidelity.

**Tasks:**
- [ ] `S4.1` — Install `pptxgenjs`
- [ ] `S4.2` — Build `app/api/export/ppt/[slug]/route.ts`
  - Use Playwright to screenshot each slide as PNG
  - Use `pptxgenjs` to create a 16:9 PPTX with one image per slide
- [ ] `S4.3` — Add slide title/notes to PPTX metadata from `presentations.json`
- [ ] `S4.4` — Set correct Content-Type (`application/vnd.openxmlformats-officedocument.presentationml.presentation`) and Content-Disposition
- [ ] `S4.5` — Cache generated PPTX in `/public/exports/ppt/` same as PDF

**Acceptance criteria:** Clicking "Download PPT" downloads a valid `.pptx` file openable in PowerPoint/Keynote/Google Slides. Each slide is a full-bleed image.

---


## Data Model

```typescript
interface Presentation {
  id: string;           // UUID
  slug: string;         // URL-friendly, e.g. "cuando-ia-programa"
  title: string;
  description?: string;
  event?: string;       // e.g. "Jornada de Tecnología — UNLP"
  date: string;         // ISO 8601: "2026-05-10"
  tags: string[];       // e.g. ["ai", "software-engineering"]
  htmlPath: string;     // relative to /public: "presentations/slug.html"
  thumbnailPath?: string;
}
```

New talks are added by:
1. Dropping `slug.html` into `public/presentations/`
2. Adding an entry to `data/presentations.json`
3. Running `npm run generate-thumbnails` (Playwright script)

---

## Key Risks & Assumptions

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Playwright PDF fidelity breaks with CSS animations | Medium | Medium | Pause animations before capture via injected JS |
| Google Fonts CDN unavailable during export | Medium | High | Bundle fonts locally in `public/fonts/` |
| PPT slides are images, not editable — attendee expectation mismatch | High | Low | Label clearly in the UI: "PPTX (image slides)" |
| Playwright unavailable in deployment environment | Low | High | Verify before deploying; fallback to VPS if Vercel blocks headless Chrome |

**Critical assumptions to validate first:**
1. `jornadaTecnologia.html` is fully self-contained — no relative paths to local assets.
2. Playwright can run in the target deployment environment.

---

## Execution Order

```
S0 Foundation
└── S1 Catalog
    └── S2 Viewer + Full-screen Presenter
        └── S3 PDF Export
            └── S4 PPT Export
```

Deploy after S3. S4 is optional — PDF alone covers most real-world needs.

---

_Product Strategy Analysis by product-strategy-analyst agent · SlideHub · 2026-05-16_
