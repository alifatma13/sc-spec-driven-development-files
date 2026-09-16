"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Each link is added in the phase that creates the route it points at. */
const links = [
  { href: "/agents", label: "Agents" },
  { href: "/ailments", label: "Ailments" },
  { href: "/therapies", label: "Therapies" },
];

/**
 * The only client component in the app: `usePathname` requires one.
 * A detail page keeps its section marked, so `/agents/pip-the-planner`
 * still highlights "Agents".
 */
export default function Nav() {
  const pathname = usePathname();

  return (
    <ul className="flex list-none flex-wrap items-center gap-x-4 gap-y-1">
      {links.map(({ href, label }) => {
        const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={isCurrent ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-sm text-sm font-medium underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                isCurrent
                  ? "text-primary underline decoration-2"
                  : "text-muted hover:text-foreground hover:underline"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
