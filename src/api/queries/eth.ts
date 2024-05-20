import { useQuery } from '@tanstack/react-query'

import AggregatorV3Interface from '@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json'

import { readContracts } from '@wagmi/core'
import { Config, useChainId, useConfig } from 'wagmi'
import { Abi, formatUnits } from 'viem'

export const fetchUsdEthAmount = async (config: Config, chainId: number, usdAmount: number) => {
  const [latestRoundData, decimals] = await readContracts(config, {
    allowFailure: false,
    contracts: [
      {
        address: import.meta.env[`VITE_ETH_USD_AGGREGATOR_ADDRESS_${chainId}`],
        abi: AggregatorV3Interface.abi as Abi,
        functionName: 'latestRoundData',
      },
      {
        address: import.meta.env[`VITE_ETH_USD_AGGREGATOR_ADDRESS_${chainId}`],
        abi: AggregatorV3Interface.abi as Abi,
        functionName: 'decimals',
      },
    ],
  })

  const ethPrice = Number(formatUnits((latestRoundData as bigint[])[1]!, decimals as number))
  return usdAmount / ethPrice
}

export const useUsdEthAmount = (usdAmount: number) => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['usdEthAmount', { usdAmount, chainId }],
    queryFn: () => fetchUsdEthAmount(config, chainId, usdAmount),
  })
}

export const fetchEthUsdAmount = async (config: Config, chainId: number, ethAmount: number) => {
  const [latestRoundData, decimals] = await readContracts(config, {
    allowFailure: false,
    contracts: [
      {
        address: import.meta.env[`VITE_ETH_USD_AGGREGATOR_ADDRESS_${chainId}`],
        abi: AggregatorV3Interface.abi as Abi,
        functionName: 'latestRoundData',
      },
      {
        address: import.meta.env[`VITE_ETH_USD_AGGREGATOR_ADDRESS_${chainId}`],
        abi: AggregatorV3Interface.abi as Abi,
        functionName: 'decimals',
      },
    ],
  })

  const ethPrice = Number(formatUnits((latestRoundData as bigint[])[1]!, decimals as number))
  return ethAmount * ethPrice
}

export const useEthUsdAmount = (ethAmount: number) => {
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: ['ethUsdAmount', { ethAmount, chainId }],
    queryFn: () => fetchEthUsdAmount(config, chainId, ethAmount),
  })
}
