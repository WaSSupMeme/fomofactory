import { useTranslation } from 'react-i18next'

import { Typography } from '@/common/components'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes'

const Landing = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-x-6 gap-y-6 sm:flex-col">
        <Typography variant="h1">{t('landing:message.title')}</Typography>
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
      </div>
    </div>
  )
}

export default Landing
