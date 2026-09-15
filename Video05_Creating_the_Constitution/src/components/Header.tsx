import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <nav aria-label="Main" className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="rounded-sm text-lg font-semibold tracking-tight text-primary decoration-accent decoration-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          AgentClinic
        </Link>
      </nav>
    </header>
  );
}
