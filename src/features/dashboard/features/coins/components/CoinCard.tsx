import { Loading, Typography } from '@/common/components'
import { cn } from '@/common/styleUtils'
import { useToken } from '@/api/queries/token'
import { TelegramIcon } from '@/assets/svg/TelegramIcon'
import { TwitterIcon } from '@/assets/svg/TwitterIcon'
import { WebIcon } from '@/assets/svg/WebIcon'

interface CoinCardProps {
  coinId: `0x${string}`
  showBorder?: boolean
}

const CoinCard = ({ coinId, showBorder = false }: CoinCardProps) => {
  const { data: token } = useToken(coinId)

  return (
    <div
      className={cn(
        'flex w-80 flex-row items-center gap-4 rounded-md bg-card px-6 py-4 text-card-foreground shadow-sm',
        showBorder && 'border',
      )}
    >
      {!token ? (
        <div className="flex w-full flex-row justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-row">
          <div className="flex w-32 flex-col gap-2 ">
            <Typography variant="regularText">{token?.name}</Typography>
            <Typography variant="mutedText">{token?.symbol}</Typography>
            <div className="flex flex-row gap-1">
              {token.metadata?.telegram && (
                <a
                  className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                  href={`https://t.me/${token.metadata.telegram.substring(1)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TelegramIcon className="h-6 w-6" />
                </a>
              )}
              {token.metadata?.twitter && (
                <a
                  className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                  href={`https://twitter.com/${token.metadata.twitter.substring(1)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TwitterIcon className="h-6 w-6" />
                </a>
              )}
              {token.metadata?.website && (
                <a
                  className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                  href={token.metadata.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WebIcon className="h-6 w-6 fill-primary" />
                </a>
              )}
            </div>
          </div>
          <div className="flex ">
            <img
              className="aspect-square h-32 w-32 rounded-full object-cover"
              src={token.avatar}
              alt={token.name}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CoinCard
