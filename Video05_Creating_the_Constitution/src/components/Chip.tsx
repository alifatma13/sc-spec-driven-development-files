import Link from "next/link";

export default function Chip({ href, children }: { href: string; children: string }) {
  return (
    <li>
      <Link
        href={href}
        className="inline-flex min-h-11 items-center rounded-full border border-primary/40 bg-primary/5 px-4 text-sm text-primary transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {children}
      </Link>
    </li>
  );
}
