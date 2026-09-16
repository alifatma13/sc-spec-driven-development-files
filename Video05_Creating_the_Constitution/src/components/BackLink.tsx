import Link from "next/link";

export default function BackLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1 rounded-sm text-sm text-muted underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span aria-hidden="true">&larr;</span>
      {children}
    </Link>
  );
}
