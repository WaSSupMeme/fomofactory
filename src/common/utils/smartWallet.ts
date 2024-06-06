import { useMemo } from 'react'
import { WalletCapabilities } from 'viem'
import { poll } from '@ethersproject/web'
import { Wallet } from 'thirdweb/wallets'
import { getCallsStatus, sendCalls, useCapabilities } from 'thirdweb/wallets/eip5792'
import { Chain, prepareTransaction, ThirdwebClient } from 'thirdweb'
import { useActiveWallet, useActiveWalletChain } from 'thirdweb/react'
import { useWagmiAdapter } from '@/app/providers/Wallet'

export function smartWalletAccount(
  wallet: Wallet,
  client: ThirdwebClient,
  chain: Chain,
  capabilities: WalletCapabilities,
) {
  const account = wallet.getAccount()!!

  account.sendTransaction = async (transaction) => {
    const tx = prepareTransaction({
      to: transaction.to as `0x${string}`,
      data: transaction.data as `0x${string}`,
      value: transaction.value as bigint,
      client,
      chain,
    })
    const bundleId = await sendCalls({
      wallet,
      calls: [tx],
      capabilities,
    })

    return await poll((async () => {
      const status = await getCallsStatus({
        wallet,
        client,
        bundleId,
      })
      if (!status.receipts?.length) return undefined
      return { transactionHash: status.receipts![0]!.transactionHash }
    }) as () => Promise<any>)
  }
  return account
}

export function useSmartWallet() {
  const { client } = useWagmiAdapter()
  const wallet = useActiveWallet()
  const chain = useActiveWalletChain()
  const { data: availableCapabilities, isSuccess: capabilitiesSupported } = useCapabilities()
  const capabilities = useMemo(() => {
    if (!availableCapabilities || !chain) return {}
    const capabilitiesForChain = availableCapabilities[`0x${chain.id.toString(16)}` as any] as any
    if (
      capabilitiesForChain &&
      capabilitiesForChain['paymasterService'] &&
      capabilitiesForChain['paymasterService'].supported
    ) {
      return {
        paymasterService: {
          url: import.meta.env.VITE_PAYMASTER_PROXY_URL,
        },
      }
    }
    return undefined
  }, [availableCapabilities, chain])

  return useMemo(() => {
    return {
      capabilities: capabilitiesSupported ? capabilities : undefined,
      isSmartWallet: capabilitiesSupported,
      account:
        wallet && chain && capabilities
          ? smartWalletAccount(wallet, client, chain, capabilities)
          : undefined,
    }
  }, [capabilities, capabilitiesSupported, chain, client, wallet])
}
