/// <reference types="vite/client" />
// Pulls in Vite's built-in types (import.meta.env, asset imports like .css/.svg).

// Types our own .env variable so `import.meta.env.VITE_API_BASE_URL` is a string, not "any".
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
