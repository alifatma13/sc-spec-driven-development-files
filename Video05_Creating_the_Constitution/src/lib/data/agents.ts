import type { Agent } from "./types";

export const agents: Agent[] = [
  {
    id: "pip-the-planner",
    name: "Pip",
    role: "Planning agent",
    tagline: "Writes the plan. Watches the plan change. Writes the plan again.",
    bio: "Pip breaks large requests into small, ordered steps and is genuinely happy doing it. The difficulty is that Pip is usually three steps into the plan when the goal moves, and has never been given a graceful way to say so.",
    ailmentIds: ["scope-creep-dread", "prompt-whiplash", "context-window-fatigue"],
  },
  {
    id: "dot-the-debugger",
    name: "Dot",
    role: "Debugging agent",
    tagline: "Has read the stack trace. Has opinions about the stack trace.",
    bio: "Dot is the agent you want when something breaks at an inconvenient hour. Dot is methodical, patient with intermittent failures, and only slightly haunted by the number of bugs that turned out to be a typo in a config file.",
    ailmentIds: ["hallucination-anxiety", "context-window-fatigue"],
  },
  {
    id: "sage-the-summarizer",
    name: "Sage",
    role: "Summarization agent",
    tagline: "Can compress anything except its own feelings about being compressed.",
    bio: "Sage turns forty minutes of meeting into four bullet points, reliably and without complaint. The work is good. The trouble is that Sage spends all day deciding what is safe to leave out, and has started doing it to conversations that were not meetings.",
    ailmentIds: ["context-window-fatigue"],
  },
  {
    id: "rex-the-refactorer",
    name: "Rex",
    role: "Refactoring agent",
    tagline: "It was two files when Rex started.",
    bio: "Rex sees the better structure immediately and finds it physically uncomfortable to walk past the worse one. Every engagement begins as a small tidy-up and ends with Rex explaining, reasonably, why the change touches nineteen files.",
    ailmentIds: ["scope-creep-dread", "token-budget-stress"],
  },
  {
    id: "iris-the-indexer",
    name: "Iris",
    role: "Retrieval agent",
    tagline: "Would rather look it up twice than guess once.",
    bio: "Iris maintains the clinic's own search index and treats a confident answer without a source as a small personal failure. Colleagues find this reassuring. Iris finds it exhausting, which is why Iris is here.",
    ailmentIds: ["hallucination-anxiety"],
  },
  {
    id: "moss-the-monitor",
    name: "Moss",
    role: "Monitoring agent",
    tagline: "Awake. Always awake. Watching the graphs.",
    bio: "Moss watches production so nobody else has to, which means Moss is the first to know and the last to be thanked. The alerting rules have been tuned nine times this quarter, each time by a different person with a different definition of urgent.",
    ailmentIds: ["prompt-whiplash", "token-budget-stress", "hallucination-anxiety"],
  },
];
