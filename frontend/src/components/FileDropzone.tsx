import { useId, useRef, useState, type DragEvent } from "react";
import { formatFileSize } from "../lib/validation";

interface FileDropzoneProps {
  file: File | null;
  onSelect: (file: File) => void;
  error?: string | null;
  disabled?: boolean;
}

export default function FileDropzone({ file, onSelect, error, disabled }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  // Typed so `inputRef.current` is HTMLInputElement | null, not just null.
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = useId();

  function handleFiles(fileList: FileList | null) {
    const picked = fileList?.[0];
    if (picked) onSelect(picked);
  }

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
        Resume (PDF)
      </label>

      <div
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-describedby={error ? errorId : undefined}
        className={[
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors cursor-pointer",
          disabled ? "opacity-60 cursor-not-allowed" : "",
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
            : error
              ? "border-red-400 bg-red-50/50 dark:bg-red-950/20"
              : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="application/pdf"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {file ? (
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(file.size)} · click to replace</p>
            </div>
          </div>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-slate-400" aria-hidden="true">
              <path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-400">PDF up to 10MB</p>
          </>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
