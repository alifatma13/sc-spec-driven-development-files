import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
  href: string;
  title: string;
  summary: string;
  /** Small label above the title, such as an agent's role. */
  eyebrow?: string;
  /** Footer slot, such as a severity chip or a duration. */
  children?: ReactNode;
};

/**
 * The whole card is one link, so each card is a single tab stop.
 * `h-full` keeps cards in the same grid row the same height.
 */
export default function Card({ href, title, summary, eyebrow, children }: CardProps) {
  return (
    <li className="h-full">
      <Link
        href={href}
        className="flex h-full flex-col gap-2 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5"
      >
        {eyebrow ? (
          <span className="text-xs font-medium tracking-wide text-muted uppercase">{eyebrow}</span>
        ) : null}
        <span className="text-lg font-semibold tracking-tight text-primary text-balance">
          {title}
        </span>
        <span className="text-sm text-muted text-pretty">{summary}</span>
        {children ? <span className="mt-auto pt-2">{children}</span> : null}
      </Link>
    </li>
  );
}
