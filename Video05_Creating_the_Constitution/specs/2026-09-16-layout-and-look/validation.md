# Phase 2 Validation — Layout and Look

## Definition of Done

All of the following must be true before this branch is merged.

> On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`. Use `curl.exe` for the commands below.

### 1. Lint and tests pass

```
npm run lint
npm test
```

`npm run lint` must exit with code 0 and report no errors or warnings. `npm test` must exit with code 0 with every test passing.

Responsive behavior is deliberately not asserted here: jsdom has no layout engine and does not evaluate media queries, so it cannot tell a working breakpoint from a broken one. Check 7 covers it in a real browser.

### 2. Production build succeeds

```
npm run build
```

Must exit with code 0, with no TypeScript errors, and the output must list the `/` route. The build downloads the Geist fonts, so it needs network access.

### 3. Production server serves the shared layout

```
npm start
curl.exe -s -o NUL -w "%{http_code}" http://localhost:3000
$html = curl.exe -s http://localhost:3000 | Out-String
([regex]::Matches($html, '<main')).Count
```

The HTTP status must be `200`, and the `<main` count must be `1`. The HTML must contain, in this order:

- A `<header>` containing `<nav aria-label="Main">`, whose only link is `href="/"` with the text `AgentClinic`
- One `<main>` containing an `<h1>` with the text `AgentClinic` and the tagline `A place for AI agents to get relief from their humans.`
- A `<footer>` containing `Open 24/7, because your humans are too.` and `status: 200 OK`

`<title>AgentClinic</title>` must still be present.

### 4. Fonts are self-hosted

- The `<html>` tag carries the two `next/font` variable classes, and the page's stylesheet defines `--font-geist-sans` and `--font-geist-mono`
- The served HTML does not mention `fonts.googleapis.com` or `fonts.gstatic.com`
- In the browser's DevTools Network tab, the `.woff2` font files load from `/_next/static/media/`, and no request goes to a Google domain
- In DevTools, the computed `font-family` of the body text starts with Geist, and the footer's `status: 200 OK` line uses Geist Mono

### 5. Light theme looks right

Run `npm run dev` and open `http://localhost:3000` with the system (or DevTools emulation) set to light:

- Off-white page background, with a white header and footer each separated by a thin light border
- A teal "AgentClinic" wordmark in the header, dark slate text, and a muted gray tagline
- Hovering the wordmark shows an amber underline
- Pressing Tab moves focus to the wordmark and shows a clearly visible teal outline
- The footer sits at the bottom of the window even though the page content is short

### 6. Dark theme follows the system

In DevTools, open **Rendering → Emulate CSS media feature prefers-color-scheme → dark** (or switch the OS to dark mode):

- Without a reload, the page switches to a navy background with light text, a slate-900 header and footer, and a bright teal wordmark
- The scrollbar and other browser-drawn parts also turn dark
- Switching back to light restores the light theme
- The page's stylesheet contains a `@media (prefers-color-scheme: dark)` rule that redefines the color tokens

### 7. Responsive from 320 px up

With `npm run dev` running, use DevTools' device toolbar at **320, 375, 768, 1024, and 1440 px**, in both themes:

- **No sideways scrolling at any width.** At each one, `document.documentElement.scrollWidth === window.innerWidth` is `true` in the console.
- The wordmark, heading, tagline, and both footer lines are fully visible at every width, never clipped and never overlapping.
- **The gutter holds.** Content never touches the screen edge: 16 px below `sm`, 24 px from `sm` up.
- **The footer stacks.** Its two lines sit in a column at 320 and 375 px, and on one row from `sm` (640 px) up.
- **The heading steps up.** The `<h1>` computes to 36 px (`text-4xl`) below 640 px and 48 px (`text-5xl`) at and above it, and it stays on one line at 320 px.
- **The wordmark is tappable.** Its box in DevTools is at least 44 px tall.
- **The viewport tag is Next.js' own.** The served HTML contains `<meta name="viewport" content="width=device-width, initial-scale=1"/>`, and this returns nothing:

```
Get-ChildItem src -Recurse -Include *.tsx,*.css | Select-String -Pattern 'viewport|maximum-scale|user-scalable|min-h-screen|w-screen'
```

- **Zoom works.** At 200 % browser zoom in a 1280 px window, nothing is clipped and nothing scrolls sideways.
- **Full height is dynamic.** `<body>` uses `min-h-dvh`, and on a phone (or an emulated one with browser chrome) the footer sits at the bottom without being pushed under the URL bar.

Phase 15 re-checks all of this across the finished site; it is not where responsiveness starts.

### 8. Text contrast meets WCAG AA

Every text color on every background it appears on is at least 4.5:1 (computed with the WCAG relative-luminance formula):

| Text on background | Light | Dark |
| --- | --- | --- |
| `foreground` on `background` | 17.09 | 18.41 |
| `foreground` on `surface` | 17.85 | 16.30 |
| `muted` on `background` | 4.56 | 7.87 |
| `muted` on `surface` | 4.76 | 6.96 |
| `primary` on `background` | 5.24 | 10.84 |
| `primary` on `surface` | 5.47 | 9.59 |

`globals.css` must use exactly the hex values listed in `requirements.md`. `accent` is never used as a text color (see check 9).

### 9. Components use tokens, not raw colors

```
Get-ChildItem src -Recurse -Include *.tsx | Select-String -Pattern '(gray|slate|teal|amber|stone)-\d|#[0-9a-fA-F]{3,6}\b|dark:|text-accent'
```

Must print nothing. Hex colors appear only in `src/app/globals.css`. Components use no `dark:` classes and never set text in `accent`.

### 10. Scope stayed small

```
Get-ChildItem src -Recurse -Include *.tsx | Select-String 'use client'
git diff main --stat -- package.json package-lock.json
```

Both must print nothing, meaning there are no client components and no dependency changes. In addition:

- The only route is `/`, and the only nav link is the home wordmark
- The only new source files are `src/components/Header.tsx` and `src/components/Footer.tsx`, plus their tests (`src/app/page.test.tsx`, `src/components/Header.test.tsx`) and `vitest.config.mts`
- There is no theme toggle, mobile menu, favicon, or `src/lib/data/`
- After a build, `git status` shows no `.next/` or other build output

## Not Required

- No CI pipeline
- No full cross-browser, keyboard, or accessibility audit (Phase 15). Responsive behavior is *not* deferred — see check 7
- No mobile menu (there is one nav link to collapse)
- No custom 404 or error pages (Phase 16)
- No manual light/dark toggle
