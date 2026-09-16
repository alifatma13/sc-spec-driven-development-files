import { agents } from "./agents";
import { ailments } from "./ailments";
import { therapies } from "./therapies";
import type { Agent, Ailment, Severity, Therapy } from "./types";

export type { Agent, Ailment, Severity, Therapy };

/**
 * Accessors are synchronous: the data is imported TypeScript, so there is
 * nothing to await. This keeps the list pages plain server components that
 * Vitest can render (it cannot render `async` ones).
 *
 * An agent owns `ailmentIds` and an ailment owns `therapyIds`. The reverse
 * directions are derived below rather than stored, so the two can never
 * disagree.
 *
 * Every accessor returns `readonly`: these are the live module arrays, and an
 * in-place `.sort()` by a caller would outlive the request that made it.
 */

export function getAgents(): readonly Agent[] {
  return agents;
}

export function getAgent(id: string): Agent | undefined {
  return agents.find((agent) => agent.id === id);
}

export function getAilments(): readonly Ailment[] {
  return ailments;
}

export function getAilment(id: string): Ailment | undefined {
  return ailments.find((ailment) => ailment.id === id);
}

export function getTherapies(): readonly Therapy[] {
  return therapies;
}

export function getTherapy(id: string): Therapy | undefined {
  return therapies.find((therapy) => therapy.id === id);
}

/** The ailments on an agent's chart. Unknown ids are dropped. */
export function getAilmentsForAgent(agentId: string): readonly Ailment[] {
  const agent = getAgent(agentId);
  if (!agent) return [];

  return agent.ailmentIds
    .map((ailmentId) => getAilment(ailmentId))
    .filter((ailment): ailment is Ailment => ailment !== undefined);
}

/** Derived from the agents' charts, never stored. */
export function getAgentsForAilment(ailmentId: string): readonly Agent[] {
  return agents.filter((agent) => agent.ailmentIds.includes(ailmentId));
}

/** The therapies recommended for an ailment. Unknown ids are dropped. */
export function getTherapiesForAilment(ailmentId: string): readonly Therapy[] {
  const ailment = getAilment(ailmentId);
  if (!ailment) return [];

  return ailment.therapyIds
    .map((therapyId) => getTherapy(therapyId))
    .filter((therapy): therapy is Therapy => therapy !== undefined);
}

/** Derived from the ailments' treatment lists, never stored. */
export function getAilmentsForTherapy(therapyId: string): readonly Ailment[] {
  return ailments.filter((ailment) => ailment.therapyIds.includes(therapyId));
}
