import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'

import {
  ThirdwebProvider,
  useActiveWallet,
  useActiveAccount,
  useActiveWalletChain,
} from 'thirdweb/react'
import { createThirdwebClient, defineChain } from 'thirdweb'

import { providers } from 'ethers'

import {
  ProviderNotFoundError,
  WagmiProvider,
  createConfig,
  createConnector,
  http,
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'
import { base } from 'wagmi/chains'
import { viemAdapter } from 'thirdweb/adapters/viem'
import { clientToSigner } from '@/common/utils/ethers'
import { useSmartWallet } from '@/common/utils/smartWallet'

interface Props {
  children: ReactNode
}

interface WagmiAdapterContextType {
  client: ReturnType<typeof createThirdwebClient>
  viemClientWallet?: ReturnType<typeof viemAdapter.walletClient.toViem>
  chain: ReturnType<typeof defineChain>
}

export const WagmiAdapterContext = createContext<WagmiAdapterContextType>({
  client: createThirdwebClient({ clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID }),
  chain: defineChain({ id: base.id }),
})

export const useWagmiAdapter = () => {
  return useContext(WagmiAdapterContext)
}

export type ThirdWebParameters = {
  client?: ReturnType<typeof viemAdapter.walletClient.toViem>
  shimDisconnect?: boolean
}

export function thirdWebWallet(parameters: ThirdWebParameters) {
  const { client, shimDisconnect = false } = parameters

  type Provider = providers.Provider | undefined
  type Properties = {}
  type StorageItem = { 'thirdweb.disconnected': true }

  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: 'thirdweb',
    name: 'ThirdWeb',
    type: 'thirdweb',
    async connect() {
      const provider = await this.getProvider()
      if (!provider) throw new ProviderNotFoundError()

      const accounts = await this.getAccounts()
      const chainId = await this.getChainId()

      provider.on('disconnect', this.onDisconnect.bind(this))

      // Remove disconnected shim if it exists
      if (shimDisconnect) await config.storage?.removeItem('thirdweb.disconnected')

      return { accounts, chainId }
    },
    async disconnect() {
      const provider = await this.getProvider()
      if (!provider) throw new ProviderNotFoundError()

      provider.removeListener('disconnect', this.onDisconnect.bind(this))

      // Add shim signalling connector is disconnected
      if (shimDisconnect) await config.storage?.setItem('thirdweb.disconnected', true)
    },
    async getAccounts() {
      if (!client?.account?.address) throw new ProviderNotFoundError()

      return [client.account.address]
    },
    async getProvider() {
      if (!client) throw new ProviderNotFoundError()
      return clientToSigner(client as any).provider
    },
    async getChainId() {
      if (!client?.chain?.id) throw new ProviderNotFoundError()
      return Number(client.chain.id)
    },
    async isAuthorized() {
      try {
        const isDisconnected =
          shimDisconnect &&
          // If shim exists in storage, connector is disconnected
          (await config.storage?.getItem('thirdweb.disconnected'))
        if (isDisconnected) return false

        const accounts = await this.getAccounts()
        return !!accounts.length
      } catch {
        return false
      }
    },
    async getClient() {
      return client as any
    },
    onAccountsChanged() {},
    onChainChanged() {},
    onDisconnect() {
      config.emitter.emit('disconnect')
    },
  }))
}

const WagmiAdapter = ({ children }: Props) => {
  const wagmiAccount = useAccount()
  const activeWallet = useActiveWallet()
  const account = useActiveAccount()
  const chain = useActiveWalletChain()
  const { isSmartWallet, capabilities, account: smartWalletAccount } = useSmartWallet()
  const client = createThirdwebClient({
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
  })
  const viemClientWallet = useMemo(() => {
    if (!chain || !account) return undefined
    if (isSmartWallet && smartWalletAccount)
      return viemAdapter.walletClient.toViem({
        client,
        chain,
        account: smartWalletAccount,
      })
    return viemAdapter.walletClient.toViem({
      client,
      chain,
      account,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, account, activeWallet, capabilities, chain, smartWalletAccount])
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  useEffect(() => {
    console.log(activeWallet, account)
    const disconnectIfNeeded = async () => {
      if (activeWallet && chain && account && wagmiAccount.status === 'disconnected') {
        await connectAsync({ connector: thirdWebWallet({ client: viemClientWallet }) })
      }
      if (!activeWallet && wagmiAccount.status !== 'disconnected') {
        await disconnectAsync()
      }
    }
    disconnectIfNeeded()
  }, [wagmiAccount, activeWallet, disconnectAsync, connectAsync, chain, account, viemClientWallet])

  const customChain = defineChain({
    id: base.id,
    // rpc: import.meta.env.VITE_RPC_PROVIDER_URL,
  })

  return (
    <WagmiAdapterContext.Provider value={{ client, viemClientWallet, chain: customChain }}>
      {children}
    </WagmiAdapterContext.Provider>
  )
}

const WalletProvider = ({ children }: Props) => {
  // const config = getDefaultConfig({
  //   appName: import.meta.env.VITE_APP_NAME,
  //   projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  //   chains: [base],
  //   transports: {
  //     [base.id]: http(import.meta.env.VITE_RPC_PROVIDER_URL),
  //   },
  //   wallets: [
  //     {
  //       groupName: 'Popular',
  //       wallets: [coinbaseWallet],
  //     },
  //   ],
  //   ssr: import.meta.env.SSR,
  // })

  const config = createConfig({
    chains: [base],
    // connectors: [coinbaseWallet({ preference: 'all' })],
    transports: {
      [base.id]: http(import.meta.env.VITE_RPC_PROVIDER_URL),
    },
    ssr: import.meta.env.SSR,
  })

  return (
    <ThirdwebProvider>
      <WagmiProvider config={config}>
        <WagmiAdapter>{children}</WagmiAdapter>
      </WagmiProvider>
    </ThirdwebProvider>
  )
}

export default WalletProvider
