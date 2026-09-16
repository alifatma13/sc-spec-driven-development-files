import type { Metadata } from "next";
import Card from "@/components/Card";
import CardGrid from "@/components/CardGrid";
import PageHeader from "@/components/PageHeader";
import { getAgents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Agents",
  description: "The agents currently registered with AgentClinic.",
};

export default function AgentsPage() {
  const agents = getAgents();

  return (
    <>
      <PageHeader
        title="Agents"
        intro="Every agent registered with the clinic. They are all doing their best under the circumstances."
      />
      <CardGrid>
        {agents.map((agent) => (
          <Card
            key={agent.id}
            href={`/agents/${agent.id}`}
            title={agent.name}
            eyebrow={agent.role}
            summary={agent.tagline}
          />
        ))}
      </CardGrid>
    </>
  );
}
