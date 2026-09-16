export type Severity = "mild" | "moderate" | "severe";

/** An agent (patient). Owns the link to its ailments; the reverse is derived. */
export type Agent = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  bio: string;
  ailmentIds: string[];
};

/** An ailment. Owns the link to its therapies; the reverse is derived. */
export type Ailment = {
  id: string;
  name: string;
  summary: string;
  description: string;
  severity: Severity;
  therapyIds: string[];
};

export type Therapy = {
  id: string;
  name: string;
  summary: string;
  description: string;
  durationMinutes: number;
};
