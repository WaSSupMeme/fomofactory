import { useMemo } from 'react'
import { useAccount } from 'wagmi'

interface AuthState {
  userAddress?: string
  isLoggedIn: boolean
}

export const useAuthState = () => {
  const account = useAccount()
  return useMemo(
    () =>
      [
        { userAddress: account.address, isLoggedIn: account.address !== undefined } as AuthState,
      ] as const,
    [account],
  )
}
