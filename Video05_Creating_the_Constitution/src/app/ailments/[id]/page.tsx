import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Chip from "@/components/Chip";
import RelatedSection from "@/components/RelatedSection";
import SeverityChip from "@/components/SeverityChip";
import { getAgentsForAilment, getAilment, getAilments, getTherapiesForAilment } from "@/lib/data";

// PageProps is a global helper generated from the route, so `params` keeps in
// step with the folder name. It resolves to a Promise here and must be awaited.
type AilmentPageProps = PageProps<"/ailments/[id]">;

export function generateStaticParams() {
  return getAilments().map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: AilmentPageProps): Promise<Metadata> {
  const { id } = await params;
  const ailment = getAilment(id);

  if (!ailment) return { title: "Ailment not found" };

  return { title: ailment.name, description: ailment.summary };
}

export default async function AilmentPage({ params }: AilmentPageProps) {
  const { id } = await params;
  const ailment = getAilment(id);

  if (!ailment) notFound();

  const sufferers = getAgentsForAilment(ailment.id);
  const therapies = getTherapiesForAilment(ailment.id);

  return (
    <article className="flex flex-col gap-8 py-8 sm:py-12">
      <BackLink href="/ailments">All ailments</BackLink>

      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {ailment.name}
        </h1>
        <div>
          <SeverityChip severity={ailment.severity} />
        </div>
      </header>

      <p className="max-w-prose text-lg text-foreground text-pretty">{ailment.summary}</p>
      <p className="max-w-prose text-base text-muted text-pretty">{ailment.description}</p>

      <RelatedSection
        title="Therapies that help"
        emptyText="Nothing is recommended for this one yet. The clinic is still working it out."
      >
        {therapies.map((therapy) => (
          <Chip key={therapy.id} href={`/therapies/${therapy.id}`}>
            {therapy.name}
          </Chip>
        ))}
      </RelatedSection>

      <RelatedSection
        title="Who has this"
        emptyText="No agent has reported this one yet. Clinic staff suspect underreporting."
      >
        {sufferers.map((agent) => (
          <Chip key={agent.id} href={`/agents/${agent.id}`}>
            {agent.name}
          </Chip>
        ))}
      </RelatedSection>
    </article>
  );
}
