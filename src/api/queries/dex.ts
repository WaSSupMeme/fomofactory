import { useQuery } from '@tanstack/react-query'

import { readContract, multicall } from '@wagmi/core'
import { formatEther, formatUnits } from 'viem'
import { Config, useChainId, useConfig } from 'wagmi'

import { DexData } from '../models/dex'

import { erc20Abi, fomoFactoryAbi } from '../abi/generated'

interface Pool {
  attributes: {
    base_token_price_usd: number
    base_token_price_native_currency: number
    quote_token_price_usd: number
    quote_token_price_native_currency: number
    address: string
    transactions: {
      h24: {
        buys: number
        sells: number
      }
    }
    volume_usd: {
      h24: number
    }
    fdv_usd: number
    reserve_in_usd: number
  }
  relationships: {
    base_token: {
      data: {
        id: string
      }
    }
    quote_token: {
      data: {
        id: string
      }
    }
  }
}

interface DexResponse {
  data: Pool[]
}

async function extractDexData(
  config: Config,
  chainId: number,
  token: `0x${string}`,
  poolAddress: `0x${string}`,
  poolData: Pool,
) {
  const [totalSupplyRaw, decimals, tokenBalanceRaw, wethBalanceRaw] = await multicall(config, {
    allowFailure: false,
    contracts: [
      {
        address: token,
        abi: erc20Abi,
        functionName: 'totalSupply',
      },
      {
        address: token,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: token,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [poolAddress],
      },
      {
        address: import.meta.env[`VITE_WETH_ADDRESS_${chainId}`],
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [poolAddress],
      },
    ],
  })

  const totalSupply = Number(formatUnits(totalSupplyRaw, decimals))
  const tokenBalance = Number(formatUnits(tokenBalanceRaw, decimals))
  const wethBalance = Number(formatEther(wethBalanceRaw))

  const baseToken = poolData.relationships.base_token.data.id
  const quoteToken = poolData.relationships.quote_token.data.id

  const tokenPrice =
    baseToken.toLowerCase() === `base_${token.toLowerCase()}`
      ? poolData.attributes.base_token_price_usd
      : poolData.attributes.quote_token_price_usd
  const ethPrice =
    quoteToken.toLowerCase() ===
    `base_${import.meta.env[`VITE_WETH_ADDRESS_${chainId}`].toLowerCase()}`
      ? poolData.attributes.quote_token_price_usd
      : poolData.attributes.base_token_price_usd

  return {
    address: token,
    poolAddress,
    volume: {
      h24: poolData.attributes.volume_usd.h24,
    },
    liquidity: wethBalance * ethPrice + tokenBalance * tokenPrice,
    marketCap: totalSupply * tokenPrice,
  } as DexData
}

export async function fetchTokensDexData(
  config: Config,
  chainId: number,
  tokens: `0x${string}`[],
): Promise<DexData[]> {
  const poolAddresses = await Promise.all(
    tokens.map(async (token) => {
      const [poolAddress] = await readContract(config, {
        address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
        abi: fomoFactoryAbi,
        functionName: 'poolMetadataOf',
        args: [token],
      })
      return poolAddress
    }),
  )

  const response = await fetch(
    `https://api.geckoterminal.com/api/v2/networks/base/pools/multi/${poolAddresses.join(',')}`,
  )
  const resp = (await response.json()) as DexResponse
  if (!resp.data || resp.data.length !== tokens.length) {
    return tokens.map((address, idx) => ({ address, poolAddress: poolAddresses[idx] })) as DexData[]
  }

  return await Promise.all(
    tokens.map(async (token, idx) => {
      return await extractDexData(config, chainId, token, poolAddresses[idx]!!, resp.data[idx]!!)
    }),
  )
}

async function fetchTokenDexData(config: Config, chainId: number, token: `0x${string}`) {
  return (await fetchTokensDexData(config, chainId, [token]))[0]
}

export const useDexData = (address: `0x${string}`) => {
  const chainId = useChainId()
  const config = useConfig()

  return useQuery({
    queryKey: ['dexData', { address, chainId }],
    queryFn: () => fetchTokenDexData(config, chainId, address),
  })
}
