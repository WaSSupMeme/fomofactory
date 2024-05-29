import { Token } from '../models/token'

import { useQuery } from '@tanstack/react-query'

import { readContract, multicall } from '@wagmi/core'
import {
  formatEther,
  formatUnits,
  maxUint256,
  numberToHex,
  parseEther,
  parseUnits,
  PublicClient,
} from 'viem'
import { Config, useAccount, useChainId, useConfig, usePublicClient } from 'wagmi'

import { FeeAmount } from '@uniswap/v3-sdk'
import { fetchEthUsdAmount } from './eth'
import { useWallet } from '@/app/providers/Wallet'
import { erc20Abi, fomoFactoryAbi, iQuoterV2Abi } from '../abi/generated'

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
      avatar: `${import.meta.env.VITE_GATEWAY_URL}/ipfs/${avatar.ipfs_pin_hash}/${avatar.metadata.keyvalues.fileName}`,
      description: avatar.metadata.keyvalues.description,
      telegram: avatar.metadata.keyvalues.telegram,
      twitter: avatar.metadata.keyvalues.twitter,
      website: avatar.metadata.keyvalues.website,
    }
  }
  return undefined
}

const fetchToken = async (config: Config, address: `0x${string}`) => {
  const token = await multicall(config, {
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
  client: PublicClient | undefined,
  config: Config,
  chainId: number,
  address: `0x${string}`,
  tokenAmount: number,
) => {
  if (!client) throw new Error('Failed to initialize client')

  const quote = await client.simulateContract({
    address: import.meta.env[`VITE_UNISWAP_V3_QUOTER_ADDRESS_${chainId}`],
    abi: iQuoterV2Abi,
    functionName: 'quoteExactOutputSingle',
    args: [
      {
        tokenIn: address,
        tokenOut: import.meta.env[`VITE_WETH_ADDRESS_${chainId}`],
        amount: parseEther('0.0001'),
        fee: FeeAmount.HIGH,
        sqrtPriceLimitX96: 0n,
      },
    ],
  })

  const decimals = await readContract(config, {
    address,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  const referenceTokenPrice = Number(formatUnits(quote.result[0] as bigint, decimals as number))
  const referenceEthPrice = await fetchEthUsdAmount(config, chainId, 0.0001)

  return (referenceEthPrice / referenceTokenPrice) * tokenAmount
}

export const useTokenUsdAmount = (address: `0x${string}`, tokenAmount: number) => {
  const chainId = useChainId()
  const client = usePublicClient()
  const config = useConfig()

  return useQuery({
    queryKey: ['tokenUsdAmount', { address, tokenAmount, chainId }],
    queryFn: () => fetchTokenUsdAmount(client, config, chainId, address, tokenAmount),
  })
}

const fetchTokenAddress = async (
  config: Config,
  chainId: number,
  name: string,
  symbol: string,
  totalSupply: number,
  salt: number,
  creator?: `0x${string}`,
) => {
  if (!creator) {
    throw new Error('Missing creator address')
  }

  const address = await readContract(config, {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: fomoFactoryAbi,
    functionName: 'computeMemecoinAddress',
    args: [
      creator,
      name,
      symbol,
      parseUnits(totalSupply.toString(), 18),
      numberToHex(salt, { size: 32 }),
    ],
  })

  return address as `0x${string}`
}

export const useTokenAddress = (
  name: string,
  symbol: string,
  totalSupply: number,
  salt: number,
) => {
  const config = useConfig()
  const chainId = useChainId()
  const { data: wallet } = useWallet()

  return useQuery({
    queryKey: [
      'tokenAddress',
      { creator: wallet?.account.address, name, symbol, totalSupply, salt, chainId },
    ],
    queryFn: () =>
      fetchTokenAddress(config, chainId, name, symbol, totalSupply, salt, wallet?.account.address),
  })
}

const fetchAccountTokens = async (config: Config, chainId: number, account?: `0x${string}`) => {
  if (!account) {
    throw new Error('Missing account address')
  }

  const tokens = await readContract(config, {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: fomoFactoryAbi,
    functionName: 'memecoinsOf',
    args: [account],
  })

  return tokens as `0x${string}`[]
}

export const useAccountTokens = () => {
  const config = useConfig()
  const chainId = useChainId()
  const account = useAccount()

  return useQuery({
    queryKey: ['accountTokens', { chainId, account: account?.address }],
    queryFn: () => fetchAccountTokens(config, chainId, account?.address),
  })
}

const fetchTokens = async (config: Config, chainId: number) => {
  const tokens = await readContract(config, {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: fomoFactoryAbi,
    functionName: 'queryMemecoins',
    args: [0n, maxUint256, false],
  })

  return tokens as `0x${string}`[]
}

export const useTokens = () => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['tokens', { chainId }],
    queryFn: () => fetchTokens(config, chainId),
  })
}
