import { Typography } from '@/common/components'
import { cn } from '@/common/styleUtils'
import { TelegramIcon } from '@/assets/svg/TelegramIcon'
import { TwitterIcon } from '@/assets/svg/TwitterIcon'
import { WebIcon } from '@/assets/svg/WebIcon'
import { useTranslation } from 'react-i18next'
import { useTokenMetadata } from '@/client/queries/token'
import { Loader2 } from 'lucide-react'
import { LockIcon } from '@/assets/svg/LockIcon'
import { CrownIcon } from '@/assets/svg/CrownIcon'

interface Token {
  address: `0x${string}`
  name: string
  symbol: string
  marketCap?: number
  volume?: {
    h24: number
  }
  liquidity?: number
  rank?: number
}

interface CoinCardMaxProps {
  token: Token
  showBorder?: boolean
}

const CoinCardMax = ({ token, showBorder = false }: CoinCardMaxProps) => {
  const { t } = useTranslation()

  const { data: metadata } = useTokenMetadata(token.address)

  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })

  return (
    <div
      className={cn(
        'flex w-96 cursor-pointer flex-row items-center gap-4 rounded-md bg-card px-5 py-5 text-card-foreground transition duration-300 ease-in-out hover:rounded-md hover:shadow-lg hover:shadow-primary hover:outline-none hover:ring-2 hover:ring-ring md:w-fit lg:w-full xl:w-96',
        showBorder && 'border',
      )}
    >
      <div className="group relative flex w-full flex-col items-center gap-8 md:flex-row lg:flex-col">
        {token.rank === 1 && <CrownIcon className="absolute -left-1.5  h-5 w-5 fill-primary" />}
        <div className="flex w-full flex-row items-center">
          <div className="flex w-32 flex-col gap-2">
            <Typography variant="regularText">{token.name}</Typography>
            <Typography variant="mutedText">{token.symbol}</Typography>
            <div className="flex flex-row gap-1">
              {metadata?.telegram && (
                <a
                  className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                  href={`https://t.me/${metadata.telegram.substring(1)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TelegramIcon className="h-6 w-6" />
                </a>
              )}
              {metadata?.twitter && (
                <a
                  className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                  href={`https://twitter.com/${metadata.twitter.substring(1)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TwitterIcon className="h-6 w-6" />
                </a>
              )}
              {metadata?.website && (
                <a
                  className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                  href={metadata.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WebIcon className="h-6 w-6 fill-foreground" />
                </a>
              )}
            </div>
          </div>
          <div className="grow"></div>
          <div className="flex h-32 w-32 items-center justify-center">
            {metadata?.avatar === undefined ? (
              <Loader2 className="size-4 animate-spin " />
            ) : (
              <img
                className="aspect-square h-full w-full rounded-lg object-cover shadow-lg shadow-primary group-hover:animate-shake group-hover:transition group-hover:duration-700"
                src={metadata?.avatar}
                alt={token.name}
              />
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {metadata?.description !== undefined && (
            <Typography variant="regularText">{metadata.description}</Typography>
          )}
          {token.liquidity !== undefined && token.liquidity !== 0 && (
            <div className="flex flex-row items-center gap-0">
              <Typography variant="regularText" className="text-primary">
                {t('coin:metadata.liquidity.label')}
              </Typography>
              <div className="grow"></div>
              <Typography variant="mutedText">{`$${formatter.format(token.liquidity)}`}</Typography>
              <LockIcon className="h-3.5 w-3.5 fill-muted-foreground" />
            </div>
          )}
          {token.marketCap !== undefined && token.marketCap !== 0 && (
            <div className="flex flex-row items-center gap-2">
              <Typography variant="regularText" className="text-primary">
                {t('coin:metadata.marketCap.label')}
              </Typography>
              <div className="grow"></div>
              <Typography variant="mutedText">{`$${formatter.format(token.marketCap)}`}</Typography>
            </div>
          )}
          {token.volume?.h24 !== undefined && token.volume?.h24 !== null && (
            <div className="flex flex-row items-center gap-1">
              <Typography variant="regularText" className="text-primary">
                {t('coin:metadata.volume.label')}
              </Typography>
              <div className="grow"></div>
              <Typography variant="mutedText">
                {`$${formatter.format(token.volume.h24)}`}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoinCardMax
