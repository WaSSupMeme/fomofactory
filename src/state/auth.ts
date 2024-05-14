import { useMemo } from 'react'
import { useWallet } from '@/app/providers/Wallet'

interface AuthState {
  userAddress?: string
  isLoggedIn: boolean
}

export const useAuthState = () => {
  const { data: wallet } = useWallet()
  return useMemo(
    () =>
      [
        { userAddress: wallet?.account.address, isLoggedIn: wallet !== undefined } as AuthState,
      ] as const,
    [wallet],
  )
}
