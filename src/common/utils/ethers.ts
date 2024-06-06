import { providers } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { useWagmiAdapter } from '@/app/providers/Wallet'

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
export function useEthersSigner() {
  const { viemClientWallet } = useWagmiAdapter()

  const signer = useMemo(() => {
    if (viemClientWallet) {
      return clientToSigner(viemClientWallet as any)
    }
    return undefined
  }, [viemClientWallet])

  return useMemo(() => {
    return signer
  }, [signer])
}
