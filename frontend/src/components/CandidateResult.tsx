import ScoreRing from "./ScoreRing";
import type { Candidate } from "../types";

interface CandidateResultProps {
  candidate: Candidate;
}

export default function CandidateResult({ candidate }: CandidateResultProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-50">
            {candidate.name || "Unnamed candidate"}
          </h3>
          {candidate.email && (
            <a
              href={`mailto:${candidate.email}`}
              className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
            >
              {candidate.email}
            </a>
          )}
        </div>
        <ScoreRing score={candidate.match_score} />
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Experience</dt>
          <dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">
            {candidate.years_of_experience} {candidate.years_of_experience === 1 ? "year" : "years"}
          </dd>
        </div>
      </dl>

      {candidate.primary_skills?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Core skills</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {candidate.primary_skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {candidate.reasoning && (
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Assessment</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{candidate.reasoning}</p>
        </div>
      )}
    </div>
  );
}
