import { Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { Loading, Layout } from '@/common/components'
import LanguageDropdown from '@/common/components/LanguageDropdown'
import ThemeDropdown from '@/common/components/ThemeDropdown'
import ConnectButton from '@/common/components/ConnectButton'
import { APP_ROUTES } from '@/app/routes/app'
import Landing from '@/common/components/Landing'
import { useAuth } from '@/common/auth'
import NewCoin from './features/coins/pages/NewCoin'
import CoinDetails from './features/coins/pages/CoinDetails'
import MyCoins from './features/coins/pages/MyCoins'

const Dashboard = () => {
  const { isLoggedIn } = useAuth()

  return (
    <>
      <Routes>
        <Route
          element={
            <Layout
              headerProps={{
                baseUrl: APP_ROUTES.index.to,
                links: [
                  ...[{ to: APP_ROUTES.newCoin.to, label: 'Make New Coin' }],
                  ...(isLoggedIn ? [{ to: APP_ROUTES.coins.to, label: 'My Coins' }] : []),
                ],
                endSlot: (
                  <>
                    <LanguageDropdown />
                    <ThemeDropdown />
                    <ConnectButton />
                  </>
                ),
              }}
            >
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </Layout>
          }
        >
          <Route index element={<Navigate replace to={APP_ROUTES.newCoin.path} />} />
          <Route path={APP_ROUTES.coins.path} element={<MyCoins />} />
          <Route path={APP_ROUTES.coinDetails.path} element={<CoinDetails />} />
          <Route path={APP_ROUTES.newCoin.path} element={<NewCoin />} />
          <Route path="*" element={<Landing />} />
        </Route>
      </Routes>
    </>
  )
}

export default Dashboard
