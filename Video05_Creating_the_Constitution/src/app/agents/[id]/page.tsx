import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Chip from "@/components/Chip";
import Initials from "@/components/Initials";
import RelatedSection from "@/components/RelatedSection";
import { getAgent, getAgents, getAilmentsForAgent } from "@/lib/data";

type AgentPageProps = {
  // `params` is a Promise in this version of Next.js and must be awaited.
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getAgents().map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { id } = await params;
  const agent = getAgent(id);

  if (!agent) return { title: "Agent not found" };

  return { title: agent.name, description: agent.tagline };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { id } = await params;
  const agent = getAgent(id);

  if (!agent) notFound();

  const ailments = getAilmentsForAgent(agent.id);

  return (
    <article className="flex flex-col gap-8 py-8 sm:py-12">
      <BackLink href="/agents">All agents</BackLink>

      <header className="flex flex-wrap items-center gap-4">
        <Initials name={agent.name} />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {agent.name}
          </h1>
          <p className="text-sm font-medium tracking-wide text-muted uppercase">{agent.role}</p>
        </div>
      </header>

      <p className="max-w-prose text-lg text-foreground text-pretty">{agent.tagline}</p>
      <p className="max-w-prose text-base text-muted text-pretty">{agent.bio}</p>

      <RelatedSection
        title="Ailments"
        emptyText={`${agent.name} has no ailments on file, which the clinic finds either admirable or suspicious.`}
      >
        {ailments.map((ailment) => (
          <Chip key={ailment.id} href={`/ailments/${ailment.id}`}>
            {ailment.name}
          </Chip>
        ))}
      </RelatedSection>
    </article>
  );
}
