import { type ReactNode } from 'react'

import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  cssStringFromTheme,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider, http, useWalletClient } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

interface Props {
  children: ReactNode
}

const WalletProvider = ({ children }: Props) => {
  const config = getDefaultConfig({
    appName: import.meta.env.VITE_APP_NAME,
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    chains: import.meta.env.DEV ? [base, baseSepolia] : [base],
    transports: {
      [base.id]: http(import.meta.env.VITE_RPC_PROVIDER_URL),
      [baseSepolia.id]: http(),
    },
    ssr: import.meta.env.SSR,
  })

  const light = lightTheme({
    accentColor: '#2B3DCA',
    accentColorForeground: '#f5f5f5',
    overlayBlur: 'none',
  })
  const dark = darkTheme({
    accentColor: '#2B3DCA',
    accentColorForeground: '#f5f5f5',
    overlayBlur: 'none',
  })

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider modalSize="compact" locale="en" theme={null}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                ${cssStringFromTheme(light)}
              }
  
              .dark {
                ${cssStringFromTheme(dark, {
                  extends: light,
                })}
              }
            `,
          }}
        />
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  )
}

export default WalletProvider
export const useWallet = useWalletClient
