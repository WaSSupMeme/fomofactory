import { type ReactNode } from 'react'

import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  cssStringFromTheme,
} from '@rainbow-me/rainbowkit'
import { coinbaseWallet } from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider, http, useWalletClient } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

interface Props {
  children: ReactNode
}

const WalletProvider = ({ children }: Props) => {
  // Enable Coinbase Smart Wallet
  coinbaseWallet.preference = 'all'

  const config = getDefaultConfig({
    appName: import.meta.env.VITE_APP_NAME,
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    chains: import.meta.env.DEV ? [base] : [base],
    transports: {
      [base.id]: http(import.meta.env.VITE_RPC_PROVIDER_URL),
      [baseSepolia.id]: http(),
    },
    wallets: [
      {
        groupName: 'Popular',
        wallets: [coinbaseWallet],
      },
    ],
    ssr: import.meta.env.SSR,
  })

  const light = lightTheme({
    accentColor: '#0050FF',
    accentColorForeground: '#f5f5f5',
    overlayBlur: 'none',
  })
  const dark = darkTheme({
    accentColor: '#0050FF',
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
                ${cssStringFromTheme({ ...light, radii: { ...light.radii, connectButton: '9999px', menuButton: '9999px' } })}
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
