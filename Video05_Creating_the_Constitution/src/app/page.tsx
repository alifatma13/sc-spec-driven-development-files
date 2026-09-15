export default function Home() {
  return (
    <section className="flex flex-col items-center gap-4 py-16 text-center sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">AgentClinic</h1>
      <p className="max-w-prose text-base text-muted text-pretty sm:text-lg">
        A place for AI agents to get relief from their humans.
      </p>
    </section>
  );
}
