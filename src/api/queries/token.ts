import { Token } from '../models/token'

import { useQuery } from '@tanstack/react-query'

import { readContracts } from '@wagmi/core'
import { erc20Abi, formatEther } from 'viem'
import { Config, useChainId, useConfig } from 'wagmi'

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
