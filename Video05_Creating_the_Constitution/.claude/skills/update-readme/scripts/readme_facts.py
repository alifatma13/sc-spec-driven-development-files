#!/usr/bin/env python3
"""List this project's routes and flag any the README does not mention.

Read-only. Run from the project root.

Routes are the only fact here worth scripting: they are spread across nested
folders, easy to miss one, and the first thing to go stale. Everything else the
README needs is already short and readable -- npm scripts and dependencies in
package.json, phase status in specs/roadmap.md. Read those directly.
"""

from __future__ import annotations

import sys
from pathlib import Path

APP = Path("src/app")
README = Path("README.md")


def routes() -> list[str]:
    """Every page.tsx under src/app, as its URL path."""
    found = []
    for page in APP.rglob("page.tsx"):
        parts = page.relative_to(APP).parts[:-1]
        # (group) folders organise files without adding a URL segment
        segments = [p for p in parts if not (p.startswith("(") and p.endswith(")"))]
        found.append("/" + "/".join(segments) if segments else "/")
    return sorted(found)


def main() -> int:
    if not APP.is_dir():
        print(f"No {APP} here - run this from the project root.", file=sys.stderr)
        return 1

    found = routes()
    print(f"Routes ({len(found)}):")
    for route in found:
        print(f"  {route}")

    if not README.is_file():
        print("\nNo README.md yet - it needs every route above.")
        return 0

    text = README.read_text(encoding="utf-8")
    missing = [route for route in found if route != "/" and route not in text]

    print("\nNot mentioned in README.md:")
    print("\n".join(f"  {route}" for route in missing) if missing else "  (none)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
