import { Typography } from '@/common/components'

import { useTranslation } from 'react-i18next'
import CoinCard from '../components/CoinCard'

const MyCoins = () => {
  const { t } = useTranslation()

  const coins = [
    '0x3339E8800Aa7233060741046650797B8723A2954' as `0x${string}`,
    '0x3339E8800Aa7233060741046650797B8723A2954' as `0x${string}`,
    '0x3339E8800Aa7233060741046650797B8723A2954' as `0x${string}`,
    '0x3339E8800Aa7233060741046650797B8723A2954' as `0x${string}`,
  ]

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <aside className="w-fit space-y-4">
        <Typography variant="h3">{t('coin:my.title')}</Typography>

        <div className="container m-auto grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {coins.map((coinId) => (
            <a
              className="w-fit transition duration-300 ease-in-out hover:rounded-md hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2"
              href={`/coins/${coinId}`}
              key={coinId}
            >
              <CoinCard showBorder coinId={coinId} />
            </a>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default MyCoins
