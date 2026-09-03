// Ten komponent nie przyjmuje żadnych propsów, więc nie potrzebuje typów —
// funkcja bez parametrów zwracająca JSX. React sam typuje zwracaną wartość.
export default function ResultSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-6 h-16 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-6 w-20 rounded-full bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-6 w-14 rounded-full bg-slate-100 dark:bg-slate-800/60" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800/60" />
      </div>
    </div>
  );
}
