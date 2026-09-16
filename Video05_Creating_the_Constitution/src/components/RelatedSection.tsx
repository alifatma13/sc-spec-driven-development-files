import { Children, type ReactNode } from "react";

type RelatedSectionProps = {
  title: string;
  /** Shown instead of the list when there is nothing to link to. */
  emptyText: string;
  children: ReactNode;
};

export default function RelatedSection({ title, emptyText, children }: RelatedSectionProps) {
  const isEmpty = Children.count(children) === 0;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {isEmpty ? (
        <p className="max-w-prose text-sm text-muted text-pretty">{emptyText}</p>
      ) : (
        <ul className="flex list-none flex-wrap gap-2">{children}</ul>
      )}
    </section>
  );
}
