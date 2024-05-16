import { type ReactNode } from 'react'

import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  cssStringFromTheme,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider, useWalletClient } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

interface Props {
  children: ReactNode
}

const WalletProvider = ({ children }: Props) => {
  const config = getDefaultConfig({
    appName: import.meta.env.VITE_APP_NAME,
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    chains: [base, baseSepolia],
    ssr: import.meta.env.SSR,
  })

  const light = lightTheme({
    accentColor: '#171717',
    accentColorForeground: '#f5f5f5',
    overlayBlur: 'none',
  })
  const dark = darkTheme({
    accentColor: '#fafafa',
    accentColorForeground: '#242424',
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
