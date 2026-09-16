import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Chip from "@/components/Chip";
import RelatedSection from "@/components/RelatedSection";
import { getAilmentsForTherapy, getTherapies, getTherapy } from "@/lib/data";

type TherapyPageProps = {
  // `params` is a Promise in this version of Next.js and must be awaited.
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getTherapies().map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: TherapyPageProps): Promise<Metadata> {
  const { id } = await params;
  const therapy = getTherapy(id);

  if (!therapy) return { title: "Therapy not found" };

  return { title: therapy.name, description: therapy.summary };
}

export default async function TherapyPage({ params }: TherapyPageProps) {
  const { id } = await params;
  const therapy = getTherapy(id);

  if (!therapy) notFound();

  const ailments = getAilmentsForTherapy(therapy.id);

  return (
    <article className="flex flex-col gap-8 py-8 sm:py-12">
      <BackLink href="/therapies">All therapies</BackLink>

      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {therapy.name}
        </h1>
        <p className="font-mono text-sm text-muted">{therapy.durationMinutes} min session</p>
      </header>

      <p className="max-w-prose text-lg text-foreground text-pretty">{therapy.summary}</p>
      <p className="max-w-prose text-base text-muted text-pretty">{therapy.description}</p>

      <RelatedSection
        title="Treats"
        emptyText="No ailment is currently referred here. The therapy remains available, and hopeful."
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
