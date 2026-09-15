# Phase 2 Requirements — Layout and Look

## Scope

Give every page a shared frame and the clinic's visual identity. The root layout renders a header, the page content, and a footer. The header holds the main navigation, which for now is only the "AgentClinic" wordmark linking home. A small set of color tokens (the "Calm clinic" palette) and the Geist font family are defined once. The colors follow the visitor's system light or dark setting. The header, footer, and existing home page all use these tokens.

## Out of Scope

- No nav links besides home. Each section's link arrives in the phase that builds its route (Phase 4 onward)
- No active-link highlighting. It needs a client component (`usePathname`) and only matters once there is a second link (Phase 4)
- No landing page copy or section links on the home page (Phase 3)
- No manual light/dark toggle. The site follows the OS setting only
- No mobile menu. The header has nothing to collapse yet
- No favicon, logo image, or Open Graph images
- No skip link or site-wide keyboard and contrast audit (Phase 15)
- No custom 404 or error pages (Phase 16)
- No new dependencies, test framework, or authentication

## Decisions

### Palette: Calm clinic, named by role
Colors are named for what they do, not their hue. Components say `bg-surface` or `text-primary` and never mention teal or slate. Changing the palette later means editing one file.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `background` | `#fafaf9` (stone-50) | `#020617` (slate-950) | Page background |
| `surface` | `#ffffff` (white) | `#0f172a` (slate-900) | Header, footer, later cards |
| `foreground` | `#0f172a` (slate-900) | `#f1f5f9` (slate-100) | Body text and headings |
| `muted` | `#64748b` (slate-500) | `#94a3b8` (slate-400) | Secondary text |
| `primary` | `#0f766e` (teal-700) | `#2dd4bf` (teal-400) | Wordmark, links, focus outlines |
| `accent` | `#f59e0b` (amber-500) | `#fbbf24` (amber-400) | Decoration only (hover underline) |
| `border` | `#e2e8f0` (slate-200) | `#1e293b` (slate-800) | Header and footer dividers |

### Primary is teal-700, not teal-600
The palette preview proposed teal-600 (`#0d9488`). On the off-white background it measures 3.59:1, below the WCAG AA minimum of 4.5:1 for normal text. Teal-700 (`#0f766e`) has the same hue and measures 5.24:1. The contrast check comes first because Steve's "attractive" goal fails if text is hard to read.

### Accent is never used for text
Amber-500 measures only 2.06:1 on the light background, so it is used only for decoration that carries no meaning on its own. In this phase that means the underline shown when hovering the wordmark, which is already teal. Focus outlines use `primary`, not `accent`, so they stay clearly visible.

### Dark mode follows the system setting
The tokens are CSS variables on `:root`, redefined inside `@media (prefers-color-scheme: dark)`. Tailwind v4's `@theme inline` turns them into utilities (`bg-background`, `text-muted`, …). Because each utility reads the variable, the same class works in both modes, so components never use `dark:` classes. `color-scheme: light dark` makes browser-drawn parts such as scrollbars match the mode. No JavaScript is involved.

### Fonts: Geist Sans and Geist Mono via `next/font/google`
Both fonts are loaded in the root layout with the `variable` option (`--font-geist-sans`, `--font-geist-mono`) and mapped to Tailwind's `--font-sans` and `--font-mono`. Body text uses Geist Sans by default, and `font-mono` gives Geist Mono. Next.js self-hosts the font files, so visitors' browsers never contact Google. The files are downloaded when the app builds, so `npm run build` needs network access. `next/font` ships with `next`, so no package is added.

### Header holds the navigation
`src/components/Header.tsx` renders a `<header>` containing `<nav aria-label="Main">`, which holds one `next/link` to `/` with the text "AgentClinic". Later phases add their links inside this `<nav>`. No separate `Nav` component yet. It gets split out when it needs its own logic (active-link highlighting in Phase 4).

### Footer: one witty line and one mono line
`src/components/Footer.tsx` shows "Open 24/7, because your humans are too." and a small mono line, `status: 200 OK`. The mono line puts Geist Mono to use right away instead of loading a font nothing uses. The copy can be adjusted in review.

### Shared components live in `src/components/`
The tech stack names the header, navigation, and footer as examples of shared components, and the root layout renders them for every route. They are imported via `@/components/Header` and `@/components/Footer`.

### The layout owns `<main>` and the page height
`<body>` becomes a full-height flex column (`min-h-dvh flex flex-col`), and `<main>` grows (`flex-1`), so the footer stays at the bottom on short pages. `<main>` moves from `page.tsx` to `layout.tsx`, so every page gets exactly one. Header, main, and footer content share the same width classes, `mx-auto w-full max-w-5xl px-4 sm:px-6`. Spacing otherwise uses Tailwind's default scale, with no custom spacing tokens.

### Home page adopts the tokens, copy unchanged
`src/app/page.tsx` keeps its heading and tagline text. It drops its `<main>` wrapper and `min-h-screen`, since the layout owns both now, and swaps `text-gray-500` for `text-muted`. Phase 3 rewrites the page.

### Server components only
The layout, page, Header, and Footer have no `"use client"`. Dark mode is pure CSS, and nothing here needs interactivity.

### Manual validation, still no test framework
The tech stack says to choose a test tool when the first real feature lands, and this phase is still foundation. It is verified with lint, build, requests to the running server, and a browser check in both color schemes (see `validation.md`).

## Context

Phase 1 left a bare page: a heading and tagline on the browser's default white, in the default font, with Tailwind's stock gray. It has no header or footer and no color or type choices. This phase builds the frame every later page sits in, so Phase 3's landing page and Phase 4's agent list only need to fill in `<main>`.

Keeping the nav to a single home link follows the mission's "small, visible steps" and the earlier decision not to build ahead. No link ever points at a page that doesn't exist.

Versions stay as pinned in Phase 1 (Next.js 16.3.5, Tailwind CSS 4.3.3). No dependency is added or upgraded.

## Stakeholder Notes

- **Steve (marketing)** gets the most out of this phase: a palette, typography, dark mode that follows the system setting, and a consistent frame on every page. Contrast is checked up front so the look stays legible.
- **Mary (engineering)** gets color tokens defined in one file, no new dependencies, untouched version pins, and server components only.
- **Susan (product)** gets no features yet. The header nav is where her sections will appear as each one ships.
