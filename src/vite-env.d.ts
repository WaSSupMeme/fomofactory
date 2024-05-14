/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_PINATA_JWT: string
  readonly VITE_GATEWAY_URL: string
  readonly VITEST?: 'true' | 'false'
  readonly CI?: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __ENABLE_MSW_IN_PROD__: boolean
