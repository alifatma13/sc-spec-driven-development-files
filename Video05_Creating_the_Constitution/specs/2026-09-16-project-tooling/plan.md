# Phase 17 Plan — Project Tooling

Steps 1–14 describe work that already shipped, reconstructed from the commits so the record is complete. Steps 15–22 are the corrections this spec found while being written. See `requirements.md` for why this plan is dated after its code.

## Group 0 — Already shipped

1. Create `.claude/skills/changelog/SKILL.md` — when to run it, what it writes, how to fix it by hand
2. Create `.claude/skills/changelog/scripts/changelog.py` — read commits with `git log --no-merges`, group by author date, insert under `## YYYY-MM-DD` headings, maintain the `changelog:last-commit` marker
3. Bootstrap `CHANGELOG.md` from full history *(commit `946bcaf`)*
4. Record that commit in the changelog *(commit `d5bb2bb`)*
5. Create `.claude/skills/update-readme/SKILL.md` — the sections a README needs and what to verify each against
6. Create `.claude/skills/update-readme/scripts/readme_facts.py` — list routes under `src/app/`, flag any the README does not mention
7. Write `README.md`: what the project is, prerequisites, how to run, the routes table, the layout, the spec workflow, roadmap status *(commit `4daf4e6`)*
8. Record that commit in the changelog *(commit `c9c4e55`)*
9. Trim `readme_facts.py` from 151 lines to 55: drop the roadmap parser, which had broken twice on formatting it had no business depending on
10. Fix `changelog.py`: reconfigure stdout to UTF-8 so a non-ASCII commit subject does not crash `--dry-run`
11. Fix `changelog.py`: use `removeprefix("- ")` rather than `lstrip("- ")`, which mangled a subject starting with a dash
12. Fix `changelog.py`: read the marker from the header only, so a bullet quoting it cannot be mistaken for the real one *(steps 9–12 are commit `b0ee30e`)*
13. Type the three dynamic pages with the generated `PageProps` helper *(commit `6a4cc63`)* — this one changed shipped Phase 5/6/8 code and is recorded as an amendment in `2026-09-16-agents-ailments-therapies/requirements.md`, not here
14. Mark phases 4–9 done in `roadmap.md` *(commit `2ec87b9`)*

## Group 1 — Corrections

15. Restore `make_stdout_safe()` in `readme_facts.py`. Step 10 added it to `changelog.py` and deleted it from this one in the same commit, while the script still prints filesystem-derived route names
16. In `changelog.py`, write the marker whenever the header lacks one, including on the no-new-commits path. Today the only `set_marker` call sits after an early `return`, so a lost marker is never restored and the subject-text fallback becomes permanent
17. In `changelog.py`, exclude `CHANGELOG.md` from the commit scan with a `:(exclude)` pathspec, so runs stop recording each other
18. In `changelog.py`, handle a repository with no commits: precheck `git rev-parse --verify HEAD` and exit with a message rather than a `CalledProcessError` traceback
19. In `changelog.py`, match date headings with `^##\s+(\d{4}-\d{2}-\d{2})\b` so a hand-decorated heading such as `## 2026-09-11 - Release 1` is recognised instead of growing a duplicate section beneath it
20. In `changelog/SKILL.md`, remove the blank line between heading and first bullet from the worked example, which the script does not emit; state that the final entry before a merge is written by hand
21. In `update-readme/SKILL.md`, drop "dependencies" from the promised reconciliation list, or add the section — today it promises a section the template does not have
22. Create `scripts/check-drift.mjs` and wire it as `npm run check`; add the Stop hook in `.claude/settings.json`

## Validation

Run the checks in `validation.md`. Phase 17 ships no UI, so there is no browser pass and no responsive check.
