import Link from "next/link";
import Nav from "@/components/Nav";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 sm:gap-y-1 sm:px-6 sm:py-3"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm text-lg font-semibold tracking-tight text-primary decoration-accent decoration-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          AgentClinic
        </Link>
        <Nav />
      </nav>
    </header>
  );
}
