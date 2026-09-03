import { useId, useState, type FormEvent } from "react";
import FileDropzone from "./FileDropzone";
import { validateFile, validateJobDescription } from "../lib/validation";

interface ScreeningFormProps {
  onSubmit: (data: { file: File; jobDescription: string }) => void;
  isSubmitting: boolean;
}

interface FormErrors {
  file?: string | null;
  jobDescription?: string | null;
}

export default function ScreeningForm({ onSubmit, isSubmitting }: ScreeningFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  // Without <FormErrors>, TS would infer `{}` and reject `errors.file` later.
  const [errors, setErrors] = useState<FormErrors>({});
  const jdId = useId();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fileError = validateFile(file);
    const jdError = validateJobDescription(jobDescription);
    if (fileError || jdError) {
      setErrors({ file: fileError, jobDescription: jdError });
      return;
    }
    setErrors({});
    // `!` (non-null assertion): validateFile already confirmed file is set above.
    onSubmit({ file: file!, jobDescription: jobDescription.trim() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FileDropzone
        file={file}
        onSelect={(f) => {
          setFile(f);
          setErrors((prev) => ({ ...prev, file: null }));
        }}
        error={errors.file}
        disabled={isSubmitting}
      />

      <div>
        <label htmlFor={jdId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Job description
        </label>
        <textarea
          id={jdId}
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
            setErrors((prev) => ({ ...prev, jobDescription: null }));
          }}
          disabled={isSubmitting}
          rows={8}
          placeholder="Paste the role's responsibilities and requirements…"
          aria-invalid={Boolean(errors.jobDescription)}
          aria-describedby={errors.jobDescription ? `${jdId}-error` : undefined}
          className={[
            "w-full resize-y rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition-colors",
            "dark:text-slate-100 dark:bg-slate-900",
            "focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500",
            errors.jobDescription
              ? "border-red-400"
              : "border-slate-300 dark:border-slate-700",
            isSubmitting ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
        />
        {errors.jobDescription && (
          <p id={`${jdId}-error`} role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {errors.jobDescription}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900"
      >
        {isSubmitting ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
            </svg>
            Screening…
          </>
        ) : (
          "Screen candidate"
        )}
      </button>
    </form>
  );
}
