import { Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { Loading, Layout } from '@/common/components'
import ThemeDropdown from '@/common/components/ThemeDropdown'
import ConnectButton from '@/common/components/ConnectButton'
import { APP_ROUTES } from '@/app/routes/app'
import Landing from '@/common/components/Landing'
import { useAuth } from '@/common/auth'
import NewCoin from './features/coins/pages/NewCoin'
import CoinDetails from './features/coins/pages/CoinDetails'
import MyCoins from './features/coins/pages/MyCoins'
import FAQ from './features/coins/pages/FAQ'
import { useTranslation } from 'react-i18next'
import Terms from '@/common/components/Terms'

const Dashboard = () => {
  const { isLoggedIn } = useAuth()
  const { t } = useTranslation()

  return (
    <>
      <Routes>
        <Route
          element={
            <Layout
              headerProps={{
                baseUrl: APP_ROUTES.index.to,
                links: [
                  ...[{ to: APP_ROUTES.newCoin.to, label: t('dashboard:header.newCoin') }],
                  ...(isLoggedIn
                    ? [{ to: APP_ROUTES.coins.to, label: t('dashboard:header.myCoins') }]
                    : []),
                  ...[{ to: APP_ROUTES.faq.to, label: t('dashboard:header.faq') }],
                ],
                endSlot: (
                  <>
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
          <Route index element={<Landing />} />
          <Route path={APP_ROUTES.coins.path} element={<MyCoins />} />
          <Route path={APP_ROUTES.coinDetails.path} element={<CoinDetails />} />
          <Route path={APP_ROUTES.newCoin.path} element={<NewCoin />} />
          <Route path={APP_ROUTES.faq.path} element={<FAQ />} />
          <Route path={APP_ROUTES.tos.path} element={<Terms />} />
          <Route path="*" element={<Navigate replace to={APP_ROUTES.index.to} />} />
        </Route>
      </Routes>
    </>
  )
}

export default Dashboard
