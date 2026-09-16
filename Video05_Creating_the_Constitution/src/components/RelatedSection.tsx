import Link from "next/link";
import Chip from "@/components/Chip";

export type RelatedItem = {
  id: string;
  href: string;
  label: string;
};

type RelatedSectionProps = {
  title: string;
  items: RelatedItem[];
  /** Shown instead of the list when there is nothing to link to. */
  emptyText: string;
  /** Where the empty state sends a visitor. Without it the page is a dead end. */
  emptyHref: string;
  emptyLinkText: string;
};

// Takes items rather than children so emptiness is `length === 0`. Children.count
// counts `false` and `null`, so a conditional chip used to render an empty list.
export default function RelatedSection({
  title,
  items,
  emptyText,
  emptyHref,
  emptyLinkText,
}: RelatedSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {items.length === 0 ? (
        <div className="flex flex-col items-start gap-1">
          <p className="max-w-prose text-sm text-muted text-pretty">{emptyText}</p>
          <Link
            href={emptyHref}
            className="inline-flex min-h-11 items-center gap-1 rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {emptyLinkText}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      ) : (
        <ul className="flex list-none flex-wrap gap-2">
          {items.map((item) => (
            <Chip key={item.id} href={item.href}>
              {item.label}
            </Chip>
          ))}
        </ul>
      )}
    </section>
  );
}
