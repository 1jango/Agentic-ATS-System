export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

// Returns an error message, or null when the file is valid.
export function validateFile(file: File | null): string | null {
  if (!file) return "Attach a resume in PDF format.";
  if (file.type !== "application/pdf") return "Only PDF files are accepted.";
  if (file.size > MAX_FILE_SIZE_BYTES) return "File is too large — max 10MB.";
  return null;
}

export function validateJobDescription(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return "Paste the job description to screen against.";
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
