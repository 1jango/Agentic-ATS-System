import { useCallback, useRef, useState } from "react";
import ScreeningForm from "./components/ScreeningForm";
import CandidateResult from "./components/CandidateResult";
import ResultSkeleton from "./components/ResultSkeleton";
import EmptyState from "./components/EmptyState";
import ErrorBanner from "./components/ErrorBanner";
import { screenCandidate } from "./lib/api";
import type { Candidate, Status } from "./types";

function App() {
  // <Status> restricts setStatus to the four values defined in types.ts.
  const [status, setStatus] = useState<Status>("idle");
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(
    async ({ file, jobDescription }: { file: File; jobDescription: string }) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStatus("loading");
      setError(null);
      resultsRef.current?.focus();

      try {
        const { candidate } = await screenCandidate(
          { file, jobDescription },
          { signal: controller.signal },
        );
        setCandidate(candidate);
        setStatus("success");
      } catch (err) {
        if (controller.signal.aborted) return;
        // Narrow `unknown` to Error before reading .message.
        setError(err instanceof Error ? err.message : "Something went wrong while screening this candidate.");
        setStatus("error");
      }
    },
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M12 3 4 7v6c0 4.4 3.4 8.4 8 9 4.6-.6 8-4.6 8-9V7l-8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">IntelligentRecruiter</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI-powered resume screening</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section aria-labelledby="form-heading">
            <h2 id="form-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Screen a candidate
            </h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <ScreeningForm onSubmit={handleSubmit} isSubmitting={status === "loading"} />
            </div>
          </section>

          <section aria-labelledby="results-heading">
            <h2 id="results-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Result
            </h2>
            <div ref={resultsRef} tabIndex={-1} className="outline-none">
              <div aria-live="polite" className="flex flex-col gap-4">
                {status === "error" && (
                  <ErrorBanner
                    message={error}
                    onDismiss={() => {
                      setError(null);
                      setStatus("idle");
                    }}
                  />
                )}
                {status === "loading" && <ResultSkeleton />}
                {status === "success" && candidate && <CandidateResult candidate={candidate} />}
                {status === "idle" && <EmptyState />}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
