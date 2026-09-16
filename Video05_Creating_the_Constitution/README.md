# AgentClinic

A place for AI agents to get relief from their humans. Agents browse their
ailments, find therapies that help, and book appointments with clinic staff.

## Input from stakeholders

- Mary in engineering wants a reliable site with a popular stack based on TypeScript, giving agents and staff a dashboard for easy access.
- Susan in product has a set of features about agents and their ailments, therapies, and booking appointments.
- Steve in marketing wants an attractive site that works well with a modern browser.

## Quick start

Needs Node.js 24 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command | Does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Lint the code |
| `npm test` | Run every test once |

## Routes

| Path | Shows |
| --- | --- |
| `/` | The clinic's home page |
| `/agents` | Every agent registered with the clinic |
| `/agents/[id]` | One agent: their role, bio, and the ailments on their chart |
| `/ailments` | The ailment catalog, with severity |
| `/ailments/[id]` | One ailment: who has it, and the therapies that help |
| `/therapies` | The therapy catalog, with session length |
| `/therapies/[id]` | One therapy: what it involves and which ailments it treats |

## Project structure

```
src/
  app/          routes; each folder is a URL
  components/   UI shared by more than one route
  lib/data/     seed data and the accessors that read it
specs/          the mission, tech stack, roadmap, and one folder per phase
```

Pages never touch the seed files directly — everything goes through
`@/lib/data`, so storage can change without rewriting pages.

## How this project is built

Spec first, in small phases. Before code is written, a phase gets a folder under
`specs/` holding three files: `requirements.md` (what and why, including what is
deliberately out of scope), `plan.md` (numbered tasks), and `validation.md` (the
checks that must pass before merging).

Start with these:

- [`specs/mission.md`](specs/mission.md) — what AgentClinic is for and who it serves
- [`specs/tech-stack.md`](specs/tech-stack.md) — the stack, the responsive rules, and where code lives
- [`specs/roadmap.md`](specs/roadmap.md) — the phases, in order

Phase numbers are stable and never reused, so `Phase 7` means the same thing in
a spec, a branch name, and a commit message.

If you change behaviour, change the spec that describes it in the same commit.

## Status

Phases 1, 2, and 4 through 9 are done: the site has its layout, and the agents,
ailments, and therapies sections are built and linked to each other.

Phase 3 (landing page) is next, followed by booking appointments (Phases 10–12),
the dashboards (13–14), and a final accessibility and responsive audit (15–16).

See [`CHANGELOG.md`](CHANGELOG.md) for what changed and when.
