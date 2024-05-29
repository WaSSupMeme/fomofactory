import { defineConfig } from '@wagmi/cli'
import { Abi, erc20Abi } from 'viem'

import FomoFactoryABI from './src/api/abi/FomoFactory.json'
import LiquidityLockerABI from './src/api/abi/LiquidityLocker.json'

import AggregatorV3Interface from '@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json' assert { type: 'json' }
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json' assert { type: 'json' }
import INonfungiblePositionManagerABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json' assert { type: 'json' }
import IQuoterV2ABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json' assert { type: 'json' }

export default defineConfig({
  out: 'src/api/abi/generated.ts',
  contracts: [
    {
      name: 'ERC20',
      abi: erc20Abi,
    },
    {
      name: 'FomoFactory',
      abi: FomoFactoryABI as Abi,
    },
    {
      name: 'LiquidityLocker',
      abi: LiquidityLockerABI as Abi,
    },
    {
      name: 'AggregatorV3Interface',
      abi: AggregatorV3Interface.abi as Abi,
    },
    {
      name: 'IUniswapV3Pool',
      abi: IUniswapV3PoolABI.abi as Abi,
    },
    {
      name: 'INonfungiblePositionManager',
      abi: INonfungiblePositionManagerABI.abi as Abi,
    },
    {
      name: 'IQuoterV2',
      abi: IQuoterV2ABI.abi as Abi,
    },
  ],
  plugins: [],
})
