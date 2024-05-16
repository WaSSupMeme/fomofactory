import { useChainId } from 'wagmi'
import { DexData } from '../models/dex'
import { useQuery } from '@tanstack/react-query'

interface Pair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    symbol: string
  }
  priceNative: string
  priceUsd?: string
  txns: {
    m5: {
      buys: number
      sells: number
    }
    h1: {
      buys: number
      sells: number
    }
    h6: {
      buys: number
      sells: number
    }
    h24: {
      buys: number
      sells: number
    }
  }
  volume: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  priceChange: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  liquidity?: {
    usd?: number
    base: number
    quote: number
  }
  fdv?: number
  pairCreatedAt?: number
}

interface SearchResponse {
  schemaVersion: string
  pairs: Pair[]
}

async function fetchDexData(address: `0x${string}`) {
  const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`)
  const resp = (await response.json()) as SearchResponse
  return resp.pairs.reduce(
    (acc, pair) => {
      acc.txns.m5.buys += pair.txns.m5.buys
      acc.txns.m5.sells += pair.txns.m5.sells
      acc.txns.h1.buys += pair.txns.h1.buys
      acc.txns.h1.sells += pair.txns.h1.sells
      acc.txns.h6.buys += pair.txns.h6.buys
      acc.txns.h6.sells += pair.txns.h6.sells
      acc.txns.h24.buys += pair.txns.h24.buys
      acc.txns.h24.sells += pair.txns.h24.sells

      acc.volume.m5 += pair.volume.m5
      acc.volume.h1 += pair.volume.h1
      acc.volume.h6 += pair.volume.h6
      acc.volume.h24 += pair.volume.h24

      acc.liquidity.usd += pair.liquidity?.usd || 0
      acc.liquidity.base += pair.liquidity?.base || 0
      acc.liquidity.quote += pair.liquidity?.quote || 0

      acc.marketCap += pair.fdv || 0

      return acc
    },
    {
      txns: {
        m5: { buys: 0, sells: 0 },
        h1: { buys: 0, sells: 0 },
        h6: { buys: 0, sells: 0 },
        h24: { buys: 0, sells: 0 },
      },
      volume: {
        m5: 0,
        h1: 0,
        h6: 0,
        h24: 0,
      },
      liquidity: {
        usd: 0,
        base: 0,
        quote: 0,
      },
      marketCap: 0,
    } as DexData,
  )
}

export const useDexData = (address: `0x${string}`) => {
  const chainId = useChainId()

  return useQuery({
    queryKey: ['dexData', { address, chainId }],
    queryFn: () => fetchDexData(address),
  })
}
