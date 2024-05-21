import { Loading, Typography } from '@/common/components'

import { useTranslation } from 'react-i18next'
import CoinCard from '../components/CoinCard'
import { useTokens } from '@/api/queries/token'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes'
import { ShrugIcon } from '@/assets/svg/ShrugIcon'

const MyCoins = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: tokens } = useTokens()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <aside className="w-fit justify-center space-y-4">
        <Typography variant="h3">{t('coin:my.title')}</Typography>

        {!tokens && (
          <div className="h-72 w-full">
            <Loading />
          </div>
        )}

        {tokens && (
          <div className="container m-auto grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {tokens.map((coinId) => (
              <div
                className="w-fit rounded-md transition duration-300 ease-in-out hover:rounded-md hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2"
                onClick={() =>
                  navigate({
                    pathname: APP_ROUTES.coinDetails.to(coinId),
                  })
                }
                key={coinId}
              >
                <CoinCard showBorder coinId={coinId} />
              </div>
            ))}
          </div>
        )}
        {tokens !== undefined && tokens.length === 0 && (
          <ShrugIcon className="h-72 w-72 fill-muted-foreground" />
        )}
      </aside>
    </div>
  )
}

export default MyCoins
