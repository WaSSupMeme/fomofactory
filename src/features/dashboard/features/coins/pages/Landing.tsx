import { useTranslation } from 'react-i18next'

import { Typography } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes'
import { InfiniteMovingCards } from '@/common/components/ui/infinite-moving-cards'
import CoinCard from '../components/CoinCard'
import { ReactElement, useEffect, useState } from 'react'
import { useTopTokens } from '@/api/queries/leaderboard'
import { BaseIcon } from '@/assets/svg/BaseIcon'

const Landing = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: tokens } = useTopTokens()
  const [cards, setCards] = useState<ReactElement[]>([])

  useEffect(() => {
    if (tokens) {
      var t = tokens
      while (t.length < 10) {
        t = t.concat(tokens)
      }
      t = t.slice(0, 10)
      setCards(
        t.map((token, tIdx) => (
          <div
            className="w-fit scale-75 rounded-md"
            onClick={() =>
              navigate({
                pathname: APP_ROUTES.coinDetails.to(token.address),
              })
            }
            key={`${token.address}-${tIdx}`}
          >
            <CoinCard showBorder={false} token={token} />
          </div>
        )),
      )
    }
  }, [tokens, navigate])

  return (
    <div className="3xl:scale-150 4xl:scale-200 flex w-full grow flex-col items-center justify-center 2xl:scale-125">
      <div className="flex h-full grow flex-col items-center justify-center gap-x-6 gap-y-6">
        <div className="flex w-dvw flex-col items-center justify-center overflow-hidden antialiased">
          <InfiniteMovingCards direction="left" speed="normal">
            {cards}
          </InfiniteMovingCards>
        </div>
        <div className="flex flex-row items-center justify-center space-x-3">
          <Typography variant="h1">{t('landing:message.title')}</Typography>
          <BaseIcon className="h-12 w-12" title={t('landing:message.imageTitle')} />
        </div>
        <Typography variant="h3">{t('landing:message.subtitle')}</Typography>
        <Button
          variant="default"
          size="lg"
          disabled={false}
          onClick={() => {
            navigate({
              pathname: APP_ROUTES.newCoin.to,
            })
          }}
        >
          {t('landing:action.start.text')}
        </Button>
        <div className="flex w-dvw flex-col items-center justify-center overflow-hidden antialiased">
          <InfiniteMovingCards direction="right" speed="normal">
            {cards}
          </InfiniteMovingCards>
        </div>
      </div>
    </div>
  )
}

export default Landing
