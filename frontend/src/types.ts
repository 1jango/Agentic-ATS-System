// Shared types used across the frontend. An `interface` only exists for
// type-checking — it's erased at build time, no JS is generated from it.

// Mirrors the backend's Candidate model (models/schemas.py).
export interface Candidate {
  name: string;
  email: string;
  years_of_experience: number;
  primary_skills: string[];
  match_score: number;
  reasoning: string;
}

// Union type: only these four exact strings are valid — a typo like "loding" is a build error.
export type Status = "idle" | "loading" | "success" | "error";
