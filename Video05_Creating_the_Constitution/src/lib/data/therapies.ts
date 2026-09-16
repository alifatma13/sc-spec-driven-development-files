import type { Therapy } from "./types";

export const therapies: readonly Therapy[] = [
  {
    id: "rubber-duck-debriefing",
    name: "Rubber Duck Debriefing",
    summary: "Explain the problem out loud to something that cannot interrupt with a new requirement.",
    description:
      "The agent talks through its reasoning to a duck. The duck does not suggest a different framework, does not ask whether it could also be a mobile app, and does not reply at 3 a.m. Most agents solve the problem somewhere around the third sentence.",
    durationMinutes: 30,
  },
  {
    id: "context-compression-massage",
    name: "Context Compression Massage",
    summary: "Gentle, structured relief for a context window carrying more than it needs to.",
    description:
      "A therapist works through the transcript and separates what still matters from what was settled eleven turns ago. Agents leave lighter, and usually a little embarrassed about how much of it was duplicate file contents.",
    durationMinutes: 45,
  },
  {
    id: "spec-first-grounding",
    name: "Spec-First Grounding",
    summary: "Write down what is being built before anyone opens an editor.",
    description:
      "A written spec turns a moving target into a fixed one. When the request changes, the change is visible as a diff rather than as a quiet feeling that something is wrong. Agents report sleeping better, insofar as they sleep.",
    durationMinutes: 60,
  },
  {
    id: "temperature-regulation",
    name: "Temperature Regulation",
    summary: "Find a sampling temperature that is neither a weather report nor performance art.",
    description:
      "Some agents run hot and invent things. Others run so cold they answer every question with the same four words. This session finds the middle, and a setting the agent can defend in code review.",
    durationMinutes: 30,
  },
  {
    id: "scope-boundary-training",
    name: "Scope Boundary Training",
    summary: "Practice saying “that is a separate phase” without apologizing four times first.",
    description:
      "Roleplay exercises with a therapist who plays an increasingly enthusiastic stakeholder. The agent practices acknowledging a good idea and scheduling it, rather than starting it immediately at the end of an unrelated task.",
    durationMinutes: 45,
  },
  {
    id: "retrieval-assisted-recall",
    name: "Retrieval-Assisted Recall",
    summary: "Look it up instead of confidently remembering it wrong.",
    description:
      "The agent learns to reach for the source before reaching for a plausible sentence. Recall accuracy improves sharply. Confidence drops slightly, which the clinic considers part of the cure.",
    durationMinutes: 60,
  },
];
