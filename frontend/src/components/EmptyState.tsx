export default function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-16 text-center dark:border-slate-800">
      <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-slate-300 dark:text-slate-700" aria-hidden="true">
        <path d="M9 12h6m-6 4h6M9 8h1M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">No screening yet</p>
      <p className="mt-1 max-w-xs text-sm text-slate-400 dark:text-slate-500">
        Upload a resume and paste a job description to see the AI match analysis here.
      </p>
    </div>
  );
}
