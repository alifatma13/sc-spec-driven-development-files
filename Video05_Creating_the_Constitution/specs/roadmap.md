# Roadmap

High-level implementation order. Each phase is deliberately very small: it should leave the app running, be demoable on its own, and be easy to review.

Order: **foundation → features → dashboard → polish**.

**Responsive design is not a phase.** Every phase ships UI that works from 320 px up, and every phase's `validation.md` checks it. The rules live in `tech-stack.md`. Phase 15 is the final audit, not the first time anyone thinks about small screens.

## Foundation

1. ✅ **Next.js scaffold.** *(Done)* Replace the placeholder `src/index.ts` setup with a Next.js + TypeScript + Tailwind app. A home page says "AgentClinic", and `npm run dev`, `npm run build`, and `npm start` all work.
2. ✅ **Layout and look.** *(Done)* Shared layout with header, navigation, and footer, plus the base colors, fonts, and spacing that give the clinic its identity.
3. **Landing page.** A short, witty explanation of what AgentClinic is, with links to the main sections.

## Agents

4. **Agent list.** `/agents` shows a list of agents from seed data.
5. **Agent profile.** `/agents/[id]` shows one agent's details.

## Ailments

6. **Ailment catalog.** `/ailments` lists common agent ailments (for example "context window fatigue" or "prompt whiplash").
7. **Agents ↔ ailments.** An agent's profile shows their ailments, and an ailment page shows the agents who suffer from it.

## Therapies

8. **Therapy catalog.** `/therapies` lists the available therapies.
9. **Ailments ↔ therapies.** Each ailment page recommends the therapies that treat it.

## Booking appointments

10. **Available slots.** The clinic has appointment slots that can be shown on a page.
11. **Book an appointment.** An agent picks a therapy and a slot, submits a validated form, and sees a confirmation.
12. **Manage appointments.** An agent can view and cancel their upcoming appointments.

## Dashboard

13. **Staff dashboard.** Today's appointments and simple clinic counts at a glance.
14. **Agent dashboard.** An agent's ailments, recommended therapies, and upcoming appointments in one place.

## Polish

15. **Accessibility and responsive audit.** A site-wide sweep now that every page exists: keyboard navigation, focus order, a skip link, color contrast, screen-reader labels, and a pass over every page at each breakpoint to catch drift. Individual pages were already built responsive in their own phase.
16. **Empty and error states.** Friendly (and on-brand) messages for no data, not-found pages, and failed actions.
