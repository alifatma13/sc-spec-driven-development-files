# Phase 2 Plan — Layout and Look

## Group 1 — Theme Tokens

1. In `src/app/globals.css`, below `@import "tailwindcss";`, define the light-mode color variables on `:root`: `--background`, `--surface`, `--foreground`, `--muted`, `--primary`, `--accent`, `--border` (values in `requirements.md`)
2. Add `color-scheme: light dark;` to `:root`
3. Redefine the same variables with the dark values inside `@media (prefers-color-scheme: dark) { :root { … } }`
4. Add an `@theme inline` block that maps `--color-background`, `--color-surface`, `--color-foreground`, `--color-muted`, `--color-primary`, `--color-accent`, and `--color-border` to those variables
5. In the same block, map `--font-sans` to `var(--font-geist-sans)` and `--font-mono` to `var(--font-geist-mono)`

## Group 2 — Fonts

6. In `src/app/layout.tsx`, import `Geist` and `Geist_Mono` from `next/font/google`. Call each with `subsets: ["latin"]` and `variable: "--font-geist-sans"` or `variable: "--font-geist-mono"`
7. Add both fonts' `.variable` classes to `<html>`, and give `<body>` the classes `font-sans antialiased`

## Group 3 — Shared Header and Footer

8. Create `src/components/Header.tsx`, a server component: a `<header>` with `bg-surface` and a bottom `border-border` divider, containing `<nav aria-label="Main">` with one `next/link` to `/` reading "AgentClinic"
9. Style the wordmark with `text-primary` and a semibold weight. Show an amber underline on hover (`decoration-accent`) and a visible `focus-visible` outline in `primary`. Make it an `inline-flex min-h-11 items-center` box so the tap target is at least 44 px tall, and step the nav's vertical padding with `py-2 sm:py-3`
10. Create `src/components/Footer.tsx`, a server component: a `<footer>` with `bg-surface` and a top `border-border` divider, containing "Open 24/7, because your humans are too." and `status: 200 OK` in `font-mono`, both small and `text-muted`, stacked in a column on phones and on one row from `sm` up
11. Wrap the header and footer content in the width classes `mx-auto w-full max-w-5xl px-4 sm:px-6`

## Group 4 — Root Layout and Home Page

12. Update `<body>` in `src/app/layout.tsx` to `flex min-h-dvh flex-col bg-background text-foreground` (plus the font classes from task 7)
13. Render `<Header />`, then `<main className="flex-1 …">` around `{children}` using the same width classes, then `<Footer />`. Leave `metadata` unchanged
14. Update `src/app/page.tsx`: replace the `<main>` wrapper with a `<section>` (the layout owns `<main>` now), remove `min-h-screen`, and swap `text-gray-500` for `text-muted`. Keep the heading and tagline text and the centered layout. Size it mobile-first: `py-16 sm:py-24`, `text-4xl sm:text-5xl` on the `<h1>`, and a `max-w-prose` tagline that wraps instead of stretching

## Group 5 — Verify

15. Run `npm run lint` and `npm test`. Both must exit 0, with no lint errors or warnings and no failing tests
16. Run `npm run build`. It must exit 0 with no type errors (this needs network access to fetch Geist)
17. Run `npm start` and check the served HTML (see `validation.md`)
18. Run `npm run dev` and check the page in a browser in both light and dark mode, using DevTools' "Emulate CSS media feature prefers-color-scheme" (see `validation.md`)
19. In DevTools' device toolbar, check the page at 320, 375, 768, 1024, and 1440 px in both themes: nothing scrolls sideways, nothing is clipped, the footer stacks below `sm`, and the wordmark's hit area is at least 44 px tall (see `validation.md`)
20. Run `git status` and `git diff main --stat` and confirm only the expected files changed, with `package.json` and `package-lock.json` untouched

## Group 6 — Wrap Up

21. Mark Phase 2 as done in `specs/roadmap.md`
