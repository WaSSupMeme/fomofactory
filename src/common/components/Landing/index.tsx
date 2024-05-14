import { useTranslation } from 'react-i18next'

import { Typography } from '@/common/components'
import { cssStringFromTheme, lightTheme, darkTheme } from '@rainbow-me/rainbowkit'
import { Button } from '../ui/button'

const Landing = () => {
  const { t } = useTranslation()

  console.log(cssStringFromTheme(lightTheme()), cssStringFromTheme(darkTheme()))

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-x-6 gap-y-6 sm:flex-col">
        <Typography variant="h1">{t('landing:message.title')}</Typography>
        <Typography variant="h3">{t('landing:message.subtitle')}</Typography>
        <Button variant="default" size="lg" disabled={false} onClick={() => {}}>
          {t('landing:action.start.text')}
        </Button>
      </div>
    </div>
  )
}

export default Landing
