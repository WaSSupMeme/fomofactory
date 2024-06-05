import { providers } from 'ethers'
import { useMemo } from 'react'
import { Account, Chain, Client, Transport, WalletCapabilities } from 'viem'
import { writeContract, WriteContractParameters } from '@wagmi/core'
import { Config, useAccount } from 'wagmi'
import { useCapabilities } from 'wagmi/experimental'
import { getCallsStatus, sendCalls, writeContracts } from '@wagmi/core/experimental'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import { poll } from '@ethersproject/web'
import { useEthersProvider } from './ethers'

export function clientToSmartWalletSigner(
  config: Config,
  client: Client<Transport, Chain, Account>,
  capabilities: WalletCapabilities,
) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)

  const sendUncheckedTransaction = async (transaction: Deferrable<TransactionRequest>) => {
    const id = await sendCalls(config, {
      account: transaction.from as `0x${string}`,
      calls: [
        {
          to: transaction.to as `0x${string}`,
          data: transaction.data as `0x${string}`,
          value: transaction.value as bigint,
        },
      ],
      capabilities,
    })

    return await poll<`0x${string}`>(
      (async () => {
        const status = await getCallsStatus(config, {
          id,
        })
        if (!status.receipts?.length) return undefined
        return status.receipts![0]!.transactionHash
      }) as () => Promise<`0x${string}`>,
      { oncePoll: provider },
    )
  }

  signer.sendUncheckedTransaction = sendUncheckedTransaction
  signer.sendTransaction = async (transaction) => {
    const hash = await sendUncheckedTransaction(transaction)
    return await provider.getTransaction(hash)
  }

  signer.provider.getSigner = (_) => signer
  signer.connectUnchecked = () => signer
  return signer
}

export function useSmartWallet() {
  const account = useAccount()
  const { data: availableCapabilities, isSuccess: capabilitiesSupported } = useCapabilities({
    account: account.address,
  })
  const capabilities = useMemo(() => {
    if (!availableCapabilities || !account.chainId) return {}
    const capabilitiesForChain = availableCapabilities[account.chainId]
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
    return {}
  }, [availableCapabilities, account])

  return useMemo(() => {
    return {
      capabilities: capabilitiesSupported ? capabilities : undefined,
      isSmartWallet: capabilitiesSupported,
    }
  }, [capabilities, capabilitiesSupported])
}

export function useWriteContract() {
  const { capabilities, isSmartWallet } = useSmartWallet()
  const provider = useEthersProvider()

  return useMemo(() => {
    if (!isSmartWallet || !capabilities)
      return {
        writeContract: async (config: Config, args: WriteContractParameters) =>
          await writeContract(config, args),
      }
    return {
      writeContract: async (config: Config, args: WriteContractParameters) => {
        const id = await writeContracts(config, {
          contracts: [args],
          capabilities,
        })
        return await poll<`0x${string}`>(
          (async () => {
            const status = await getCallsStatus(config, {
              id,
            })
            if (!status.receipts?.length) return undefined
            return status.receipts![0]!.transactionHash
          }) as () => Promise<`0x${string}`>,
          { oncePoll: provider },
        )
      },
    }
  }, [capabilities, isSmartWallet, provider])
}
