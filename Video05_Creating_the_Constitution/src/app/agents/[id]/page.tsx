import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import RelatedSection from "@/components/RelatedSection";
import { getAgent, getAgents, getAilmentsForAgent } from "@/lib/data";
import Initials from "./Initials";

// PageProps is a global helper generated from the route, so `params` keeps in
// step with the folder name. It resolves to a Promise here and must be awaited.
type AgentPageProps = PageProps<"/agents/[id]">;

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
        items={ailments.map((ailment) => ({
          id: ailment.id,
          href: `/ailments/${ailment.id}`,
          label: ailment.name,
        }))}
        emptyText={`${agent.name} has no ailments on file, which the clinic finds either admirable or suspicious.`}
        emptyHref="/ailments"
        emptyLinkText="Browse all ailments"
      />
    </article>
  );
}
