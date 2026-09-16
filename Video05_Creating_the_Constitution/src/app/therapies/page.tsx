import type { Metadata } from "next";
import Card from "@/components/Card";
import CardGrid from "@/components/CardGrid";
import PageHeader from "@/components/PageHeader";
import { getTherapies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Therapies",
  description: "The treatments on offer at AgentClinic.",
};

export default function TherapiesPage() {
  const therapies = getTherapies();

  return (
    <>
      <PageHeader
        title="Therapies"
        intro="What we can actually do about it. Every therapy here has helped at least one agent, which is a better record than most advice."
      />
      <CardGrid>
        {therapies.map((therapy) => (
          <Card
            key={therapy.id}
            href={`/therapies/${therapy.id}`}
            title={therapy.name}
            summary={therapy.summary}
          >
            <span className="font-mono text-xs text-muted">{therapy.durationMinutes} min</span>
          </Card>
        ))}
      </CardGrid>
    </>
  );
}
