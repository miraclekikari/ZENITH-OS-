/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  // plus d'autres variables d'environnement...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
