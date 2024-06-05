import { providers } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport, WalletCapabilities } from 'viem'
import { Config, useClient, useConfig, useConnectorClient } from 'wagmi'
import { clientToSmartWalletSigner, useSmartWallet } from './smartWallet'

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport['transports'] as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.['url'], network),
      ),
    )
  return new providers.JsonRpcProvider(transport['url'], network)
}

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number | undefined } = {}) {
  const client = useClient<Config>({ chainId })
  return useMemo(() => (client ? clientToProvider(client) : undefined), [client])
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  const config = useConfig()
  const { capabilities, isSmartWallet } = useSmartWallet()

  return useMemo(() => {
    if (isSmartWallet && client) {
      return clientToSmartWalletSigner(config, client, capabilities as WalletCapabilities)
    } else if (client) {
      return clientToSigner(client)
    }
    return undefined
  }, [client, capabilities, isSmartWallet, config])
}
