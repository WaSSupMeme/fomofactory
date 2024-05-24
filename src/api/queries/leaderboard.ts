import { useQuery } from '@tanstack/react-query'

import { readContract } from '@wagmi/core'
import { Abi, maxUint256 } from 'viem'
import { Config, useChainId, useConfig } from 'wagmi'

import FomoFactoryABI from '../abi/FomoFactory.json'
import { fetchTokensDexData } from './dex'

const fetchTopTokens = async (config: Config, chainId: number) => {
  const tokens = (await readContract(config, {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: FomoFactoryABI as Abi,
    functionName: 'queryMemecoins',
    args: [0, maxUint256, false],
  })) as `0x${string}`[]

  const dexData = (await fetchTokensDexData(config, chainId, tokens)).filter(
    (token) => token.marketCap,
  )

  const dexDataSorted = dexData.sort((t1, t2) => t2.marketCap!! - t1.marketCap!!)

  return dexDataSorted.map((token, idx) => {
    return { rank: idx + 1, address: token.address }
  })
}

export const useTopTokens = () => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['topTokens', { chainId }],
    queryFn: () => fetchTopTokens(config, chainId),
  })
}
