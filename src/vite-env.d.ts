/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_HOTLINE?: string;
  readonly VITE_ZALO?: string;
  readonly VITE_FACEBOOK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
