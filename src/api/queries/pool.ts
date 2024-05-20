import { Pool } from '../models/pool'

import { useQuery } from '@tanstack/react-query'

import { readContract, readContracts } from '@wagmi/core'
import { Abi, formatEther, maxUint128, PublicClient } from 'viem'
import { Config, useChainId, useConfig, usePublicClient } from 'wagmi'

import FomoFactoryABI from '../abi/FomoFactory.json'
import LiquidityLockerABI from '../abi/LiquidityLocker.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import INonfungiblePositionManagerABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json'

const fetchPool = async (
  client: PublicClient | undefined,
  config: Config,
  chainId: number,
  tokenAddress: `0x${string}`,
) => {
  if (!client) throw new Error('Failed to initialize client')

  const [address, positionId] = (await readContract(config, {
    address: import.meta.env[`VITE_FOMO_FACTORY_ADDRESS_${chainId}`],
    abi: FomoFactoryABI as Abi,
    functionName: 'poolMetadataOf',
    args: [tokenAddress],
  })) as [`0x${string}`, number]

  const owner = (await readContract(config, {
    address: import.meta.env[`VITE_LIQUIDITY_LOCKER_ADDRESS_${chainId}`],
    abi: LiquidityLockerABI as Abi,
    functionName: 'ownerOf',
    args: [positionId],
  })) as `0x${string}`

  const [token0, token1] = await readContracts(config, {
    allowFailure: false,
    contracts: [
      {
        address: address,
        abi: IUniswapV3PoolABI.abi as Abi,
        functionName: 'token0',
      },
      {
        address: address,
        abi: IUniswapV3PoolABI.abi as Abi,
        functionName: 'token1',
      },
    ],
  })

  const fees = await client.simulateContract({
    address: import.meta.env[`VITE_UNISWAP_V3_NONFUNGIBLE_POSITION_MANAGER_ADDRESS_${chainId}`],
    abi: INonfungiblePositionManagerABI.abi,
    functionName: 'collect',
    args: [
      {
        tokenId: positionId,
        recipient: address,
        amount0Max: maxUint128,
        amount1Max: maxUint128,
      },
    ],
  })

  return {
    address,
    owner,
    positionId,
    token0,
    token1,
    fees: {
      token0: Number(formatEther(fees.result[0])),
      token1: Number(formatEther(fees.result[1])),
    },
  } as Pool
}

export const usePool = (tokenAddress: `0x${string}`) => {
  const config = useConfig()
  const chainId = useChainId()
  const client = usePublicClient()

  return useQuery({
    queryKey: ['pool', { tokenAddress, chainId }],
    queryFn: () => fetchPool(client, config, chainId, tokenAddress),
  })
}
