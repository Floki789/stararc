/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_STARSHIP_API_URL: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_PRIVACY_MODE: string
  readonly VITE_ZERO_KNOWLEDGE_MODE: string
  readonly VITE_STARSHIP_DOCS_URL: string
  readonly VITE_STARSHIP_SUPPORT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
