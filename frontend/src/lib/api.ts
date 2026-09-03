import type { Candidate } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const SCREEN_TIMEOUT_MS = 90_000;

interface ScreeningErrorOptions {
  cause?: unknown;
}

export class ScreeningError extends Error {
  constructor(message: string, { cause }: ScreeningErrorOptions = {}) {
    super(message);
    this.name = "ScreeningError";
    this.cause = cause;
  }
}

// Shape of a backend error response; fields are optional since we can't guarantee which appear.
interface ApiErrorBody {
  detail?: string | Array<{ msg?: string }>;
  error?: string;
  details?: string;
}

interface ApiSuccessBody {
  request_id: string;
  data?: Candidate;
  error?: string;
  details?: string;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body: ApiErrorBody = await response.json();
    if (typeof body?.detail === "string") return body.detail;
    if (Array.isArray(body?.detail)) {
      return body.detail.map((d) => d.msg ?? String(d)).join("; ");
    }
    if (typeof body?.error === "string") {
      return body.details ? `${body.error}: ${body.details}` : body.error;
    }
  } catch {
    // response wasn't JSON — fall through to status text
  }
  return `Request failed (${response.status} ${response.statusText})`;
}

interface ScreenCandidateParams {
  file: File;
  jobDescription: string;
}

interface ScreenCandidateOptions {
  signal?: AbortSignal;
}

export async function screenCandidate(
  { file, jobDescription }: ScreenCandidateParams,
  { signal }: ScreenCandidateOptions = {},
): Promise<{ requestId: string; candidate: Candidate }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SCREEN_TIMEOUT_MS);
  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/v1/screen`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    // catch variables are typed `unknown`; narrow with instanceof before use.
    if (err instanceof Error && err.name === "AbortError") {
      throw new ScreeningError(
        "The screening is taking longer than expected. Please try again.",
        { cause: err },
      );
    }
    throw new ScreeningError(
      "Couldn't reach the screening service. Check your connection and that the backend is running.",
      { cause: err },
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new ScreeningError(await extractErrorMessage(response));
  }

  const body: ApiSuccessBody = await response.json();
  if (body.error) {
    throw new ScreeningError(
      body.details ? `${body.error}: ${body.details}` : body.error,
    );
  }
  if (!body.data) {
    throw new ScreeningError("The service returned an unexpected response.");
  }

  return { requestId: body.request_id, candidate: body.data };
}
