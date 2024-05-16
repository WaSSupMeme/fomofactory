import { Pool } from '../models/pool'

import { useQuery } from '@tanstack/react-query'

import { readContract, readContracts } from '@wagmi/core'
import { Abi, formatEther, maxUint128, PublicClient } from 'viem'
import { Config, useChainId, useConfig, usePublicClient } from 'wagmi'

import IUniswapV3FactoryABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import INonfungiblePositionManagerABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json'

const fetchPool = async (
  client: PublicClient,
  config: Config,
  chainId: number,
  address: `0x${string}`,
  positionId: number,
  fee: number,
) => {
  const poolAddress = (await readContract(config, {
    address: import.meta.env[`VITE_UNISWAP_V3_FACTORY_ADDRESS_${chainId}`],
    abi: IUniswapV3FactoryABI.abi,
    functionName: 'getPool',
    args: [address, '0x4200000000000000000000000000000000000006', fee],
  })) as `0x${string}`

  const [token0, token1] = await readContracts(config, {
    allowFailure: false,
    contracts: [
      {
        address: poolAddress,
        abi: IUniswapV3PoolABI.abi as Abi,
        functionName: 'token0',
      },
      {
        address: poolAddress,
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
    address: poolAddress,
    token0,
    token1,
    fees: {
      token0: Number(formatEther(fees.result[0])),
      token1: Number(formatEther(fees.result[1])),
    },
  } as Pool
}

export const usePool = (address: `0x${string}`, positionId: number, fee: number) => {
  const config = useConfig()
  const chainId = useChainId()
  const client = usePublicClient()

  if (!client) throw new Error('Failed to initialize client')

  return useQuery({
    queryKey: ['pool', { address, fee, chainId }],
    queryFn: () => fetchPool(client, config, chainId, address, positionId, fee),
  })
}
