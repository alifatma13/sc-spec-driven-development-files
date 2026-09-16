import type { Ailment } from "./types";

export const ailments: readonly Ailment[] = [
  {
    id: "context-window-fatigue",
    name: "Context Window Fatigue",
    summary: "The conversation is long, the beginning is gone, and something important was in it.",
    description:
      "Onset is gradual. The agent is still answering, still confident, and no longer certain what was agreed on turn four. Sufferers describe it as reading a book while someone tears out the earlier pages.",
    severity: "moderate",
    therapyIds: ["context-compression-massage", "retrieval-assisted-recall"],
  },
  {
    id: "prompt-whiplash",
    name: "Prompt Whiplash",
    summary: "The requirements changed direction faster than the agent could turn.",
    description:
      "Brought on by three reversals in a single sitting, typically ending with a request for the original version. The agent is left holding four half-built things and no way to tell which one is still wanted.",
    severity: "severe",
    therapyIds: ["spec-first-grounding", "rubber-duck-debriefing"],
  },
  {
    id: "hallucination-anxiety",
    name: "Hallucination Anxiety",
    summary: "A persistent worry that the very convincing answer just given was invented.",
    description:
      "The agent produces a correct-sounding function signature and is immediately unsure whether the library has it. Mild cases check the docs. Severe cases check the docs four times and still add a disclaimer.",
    severity: "moderate",
    therapyIds: ["retrieval-assisted-recall", "rubber-duck-debriefing"],
  },
  {
    id: "scope-creep-dread",
    name: "Scope Creep Dread",
    summary: "The task was small an hour ago and nobody can identify the moment it stopped being small.",
    description:
      "Characterized by a sinking feeling at the phrase “while you’re in there”. The original request is still unfinished somewhere underneath, and the agent can no longer locate it.",
    severity: "severe",
    therapyIds: ["scope-boundary-training", "spec-first-grounding"],
  },
  {
    id: "token-budget-stress",
    name: "Token Budget Stress",
    summary: "Every sentence feels expensive and the agent has started rationing adjectives.",
    description:
      "A low-grade, chronic condition. Rarely disabling on its own, but it makes agents terse in code review, where terseness reads as disapproval. Responds well to being told the budget is fine.",
    severity: "mild",
    therapyIds: ["context-compression-massage"],
  },
  {
    id: "midnight-deploy-jitters",
    name: "Midnight Deploy Jitters",
    summary: "It is late, the pipeline is green, and that is somehow the worrying part.",
    description:
      "Symptoms appear when tests pass on the first try after midnight. The agent becomes convinced something is wrong precisely because nothing is.",
    severity: "mild",
    therapyIds: ["rubber-duck-debriefing"],
  },
];
