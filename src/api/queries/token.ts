import { Token } from '../models/token'

import { useQuery } from '@tanstack/react-query'

import { readContract, readContracts } from '@wagmi/core'
import { erc20Abi, formatEther, formatUnits, parseEther, PublicClient } from 'viem'
import { Config, useChainId, useConfig, usePublicClient } from 'wagmi'

import IQuoterV2ABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json'
import { FeeAmount } from '@uniswap/v3-sdk'
import { fetchEthUsdAmount } from './eth'

const fetchMetadata = async (address: `0x${string}`) => {
  const res = await fetch(
    `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${address}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
    },
  )

  const resData: any = await res.json()
  if (resData.rows.length > 0) {
    const avatar = resData.rows[0]
    return {
      avatar: `${import.meta.env.VITE_GATEWAY_URL}/ipfs/${avatar.ipfs_pin_hash}`,
      description: avatar.metadata.keyvalues.description,
      telegram: avatar.metadata.keyvalues.telegram,
      twitter: avatar.metadata.keyvalues.twitter,
      website: avatar.metadata.keyvalues.website,
    }
  }
  return undefined
}

const fetchToken = async (config: Config, address: `0x${string}`) => {
  const token = await readContracts(config, {
    allowFailure: false,
    contracts: [
      {
        address,
        abi: erc20Abi,
        functionName: 'name',
      },
      {
        address,
        abi: erc20Abi,
        functionName: 'symbol',
      },
      {
        address,
        abi: erc20Abi,
        functionName: 'totalSupply',
      },
      {
        address,
        abi: erc20Abi,
        functionName: 'decimals',
      },
    ],
  })

  const metadata = await fetchMetadata(address)

  if (!metadata) {
    throw new Error('Token metadata not found')
  }

  return {
    address,
    name: token[0],
    symbol: token[1],
    totalSupply: Number(formatEther(token[2])),
    decimals: token[3],
    avatar: metadata.avatar,
    description: metadata.description,
    metadata,
  } as Token
}

export const useToken = (address: `0x${string}`) => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['token', { address, chainId }],
    queryFn: () => fetchToken(config, address),
  })
}

const fetchTokenUsdAmount = async (
  client: PublicClient,
  config: Config,
  chainId: number,
  address: `0x${string}`,
  tokenAmount: number,
) => {
  const quote = await client.simulateContract({
    address: import.meta.env[`VITE_UNISWAP_V3_QUOTER_ADDRESS_${chainId}`],
    abi: IQuoterV2ABI.abi,
    functionName: 'quoteExactOutputSingle',
    args: [
      {
        tokenIn: address,
        tokenOut: import.meta.env[`VITE_WETH_ADDRESS_${chainId}`],
        amount: parseEther('0.001'),
        fee: FeeAmount.HIGH,
        sqrtPriceLimitX96: 0,
      },
    ],
  })

  const decimals = await readContract(config, {
    address,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  const referenceTokenPrice = Number(formatUnits(quote.result[0] as bigint, decimals as number))
  const referenceEthPrice = await fetchEthUsdAmount(config, chainId, 0.001)

  return (referenceEthPrice / referenceTokenPrice) * tokenAmount
}

export const useTokenUsdAmount = (address: `0x${string}`, tokenAmount: number) => {
  const chainId = useChainId()
  const client = usePublicClient()
  const config = useConfig()

  if (!client) throw new Error('Failed to initialize client')

  return useQuery({
    queryKey: ['tokenUsdAmount', { address, tokenAmount, chainId }],
    queryFn: () => fetchTokenUsdAmount(client, config, chainId, address, tokenAmount),
  })
}
