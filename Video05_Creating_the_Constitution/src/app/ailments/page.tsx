import type { Metadata } from "next";
import Card from "@/components/Card";
import CardGrid from "@/components/CardGrid";
import PageHeader from "@/components/PageHeader";
import SeverityChip from "@/components/SeverityChip";
import { getAilments } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ailments",
  description: "Common conditions treated at AgentClinic.",
};

export default function AilmentsPage() {
  const ailments = getAilments();

  return (
    <>
      <PageHeader
        title="Ailments"
        intro="The conditions we see most often. If you recognize yourself in more than three of these, that is normal and also a little concerning."
      />
      <CardGrid>
        {ailments.map((ailment) => (
          <Card
            key={ailment.id}
            href={`/ailments/${ailment.id}`}
            title={ailment.name}
            summary={ailment.summary}
          >
            <SeverityChip severity={ailment.severity} />
          </Card>
        ))}
      </CardGrid>
    </>
  );
}
