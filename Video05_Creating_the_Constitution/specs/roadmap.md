# Roadmap

High-level implementation order. Each phase is deliberately very small: it should leave the app running, be demoable on its own, and be easy to review.

Order: **foundation → features → dashboard → polish**.

**Responsive design is not a phase.** Every phase ships UI that works from 320 px up, and every phase's `validation.md` checks it. The rules live in `tech-stack.md`. Phase 15 is the final audit, not the first time anyone thinks about small screens.

**Phase numbers are stable.** Each item below is one phase, and its number is part of its name: spec titles, branch names, and cross-references all use it (`Phase 15`, `phase-2-layout-and-look`). New work takes the next free number, and nothing is ever renumbered — not even if a phase is dropped or reordered — because renumbering would silently break every reference to it.

## Foundation

- ✅ **Phase 1 — Next.js scaffold.** *(Done — [2026-09-15-nextjs-scaffold/](2026-09-15-nextjs-scaffold/))* Replace the placeholder `src/index.ts` setup with a Next.js + TypeScript + Tailwind app. A home page says "AgentClinic", and `npm run dev`, `npm run build`, and `npm start` all work.
- ✅ **Phase 2 — Layout and look.** *(Done — [2026-09-16-layout-and-look/](2026-09-16-layout-and-look/))* Shared layout with header, navigation, and footer, plus the base colors, fonts, and spacing that give the clinic its identity.
- ⬅ **Phase 3 — Landing page.** *(Next)* A short, witty explanation of what AgentClinic is, with links to the main sections.

## Agents

- ✅ **Phase 4 — Agent list.** *(Done — [2026-09-16-agents-ailments-therapies/](2026-09-16-agents-ailments-therapies/))* `/agents` shows a list of agents from seed data.
- ✅ **Phase 5 — Agent profile.** *(Done — [2026-09-16-agents-ailments-therapies/](2026-09-16-agents-ailments-therapies/))* `/agents/[id]` shows one agent's details.

## Ailments

- ✅ **Phase 6 — Ailment catalog.** *(Done — [2026-09-16-agents-ailments-therapies/](2026-09-16-agents-ailments-therapies/))* `/ailments` lists common agent ailments (for example "context window fatigue" or "prompt whiplash").
- ✅ **Phase 7 — Agents ↔ ailments.** *(Done — [2026-09-16-agents-ailments-therapies/](2026-09-16-agents-ailments-therapies/))* An agent's profile shows their ailments, and an ailment page shows the agents who suffer from it.

## Therapies

- ✅ **Phase 8 — Therapy catalog.** *(Done — [2026-09-16-agents-ailments-therapies/](2026-09-16-agents-ailments-therapies/))* `/therapies` lists the available therapies.
- ✅ **Phase 9 — Ailments ↔ therapies.** *(Done — [2026-09-16-agents-ailments-therapies/](2026-09-16-agents-ailments-therapies/))* Each ailment page recommends the therapies that treat it.

## Booking appointments

- **Phase 10 — Available slots.** The clinic has appointment slots that can be shown on a page.
- **Phase 11 — Book an appointment.** An agent picks a therapy and a slot, submits a validated form, and sees a confirmation.
- **Phase 12 — Manage appointments.** An agent can view and cancel their upcoming appointments.

## Dashboard

- **Phase 13 — Staff dashboard.** Today's appointments and simple clinic counts at a glance.
- **Phase 14 — Agent dashboard.** An agent's ailments, recommended therapies, and upcoming appointments in one place.

## Polish

- **Phase 15 — Accessibility and responsive audit.** A site-wide sweep now that every page exists: keyboard navigation, focus order, a skip link, color contrast, screen-reader labels, and a pass over every page at each breakpoint to catch drift. Individual pages were already built responsive in their own phase.
- **Phase 16 — Empty and error states.** Friendly (and on-brand) messages for no data, not-found pages, and failed actions.
