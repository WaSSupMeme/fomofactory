import { useQuery } from '@tanstack/react-query'

import { readContract, readContracts } from '@wagmi/core'
import { Abi, erc20Abi, formatEther, formatUnits } from 'viem'
import { Config, useChainId, useConfig } from 'wagmi'

import { DexData } from '../models/dex'

import FomoFactoryABI from '../abi/FomoFactory.json'
import { fetchEthUsdAmount } from './eth'

interface Pair {
  attributes: {
    address: string
    price_usd: number
    volume_usd: {
      h24: number
    }
  }
}

interface DexResponse {
  data: Pair
}

export async function fetchDexData(
  config: Config,
  chainId: number,
  address: `0x${string}`,
): Promise<DexData> {
  const response = await fetch(
    `https://api.geckoterminal.com/api/v2/networks/base/tokens/${address}`,
  )
  const resp = (await response.json()) as DexResponse

  const [poolAddress] = (await readContract(config, {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: FomoFactoryABI as Abi,
    functionName: 'poolMetadataOf',
    args: [address],
  })) as [`0x${string}`]

  const [totalSupplyRaw, decimals, tokenBalanceRaw, wethBalanceRaw] = (await readContracts(config, {
    allowFailure: false,
    contracts: [
      {
        address: address,
        abi: erc20Abi,
        functionName: 'totalSupply',
      },
      {
        address: address,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: address,
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
  })) as [bigint, number, bigint, bigint]

  const totalSupply = Number(formatUnits(totalSupplyRaw, decimals))
  const tokenBalance = Number(formatUnits(tokenBalanceRaw, decimals))
  const wethBalance = Number(formatEther(wethBalanceRaw))

  const tokenPrice = resp.data.attributes.price_usd
  const ethPrice = await fetchEthUsdAmount(config, chainId, 1)

  return {
    address,
    poolAddress,
    volume: {
      h24: resp.data.attributes.volume_usd.h24,
    },
    liquidity: {
      usd: tokenBalance * tokenPrice + wethBalance * ethPrice,
    },
    marketCap: totalSupply * tokenPrice,
  } as DexData
}

export const useDexData = (address: `0x${string}`) => {
  const chainId = useChainId()
  const config = useConfig()

  return useQuery({
    queryKey: ['dexData', { address, chainId }],
    queryFn: () => fetchDexData(config, chainId, address),
  })
}
