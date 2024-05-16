import { useMutation } from '@tanstack/react-query'
import { TokenMetadata } from '../models/tokenMetadata'
import { useChainId } from 'wagmi'

const setTokenMetadata = async (metadata: TokenMetadata, chainId: number) => {
  const formData = new FormData()
  formData.append('file', metadata.avatar)
  const data = JSON.stringify({
    name: metadata.address,
    keyvalues: {
      chainId: chainId,
      description: metadata.description,
      twitter: metadata.twitter,
      telegram: metadata.telegram,
      website: metadata.website,
    },
  })
  formData.append('pinataMetadata', data)

  const options = JSON.stringify({
    cidVersion: 0,
  })
  formData.append('pinataOptions', options)

  await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
    },
    body: formData,
  })
}

export const useSetTokenMetadata = (options?: { onError?: (error: unknown) => void }) => {
  const chainId = useChainId()

  return useMutation({
    ...options,
    mutationKey: ['tokenMetadata', { chainId }],
    mutationFn: (metadata: TokenMetadata) => setTokenMetadata(metadata, chainId),
  })
}
