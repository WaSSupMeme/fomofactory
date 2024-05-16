import { Loading, Typography } from '@/common/components'

import { useTranslation } from 'react-i18next'
import { useCoinDetailsParams } from '@/app/routes'
import { useChainId } from 'wagmi'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/common/components/ui/tooltip'
import { addToMetamask, truncateEthAddress } from '@/common/utils'

import { TelegramIcon } from '@/assets/svg/TelegramIcon'
import { TwitterIcon } from '@/assets/svg/TwitterIcon'
import { WebIcon } from '@/assets/svg/WebIcon'
import { LockIcon } from '@/assets/svg/LockIcon'
import { ClipboardIcon } from '@/assets/svg/ClipboardIcon'
import { MetamaskIcon } from '@/assets/svg/MetamaskIcon'
import { EthRoundIcon } from '@/assets/svg/EthRoundIcon'

import { toast } from 'sonner'

import { LiFiWidget, WidgetConfig } from '@lifi/widget'
import { Theme, useTheme } from '@/app/providers/Theme'

import { FeeAmount } from '@uniswap/v3-sdk'
import { useShowError } from '@/common/hooks/usePrintErrorMessage.js'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Button } from '@/common/components/ui/button'
import { Card } from '@/common/components/ui/card'
import { useToken } from '@/api/queries/token'
import { usePool } from '@/api/queries/pool'
import { useDexData } from '@/api/queries/dex'

const CoinDetails = () => {
  const { t } = useTranslation()
  const showError = useShowError()

  const { coinId } = useCoinDetailsParams()

  const { openConnectModal } = useConnectModal()
  const chainId = useChainId()

  const { data: token, isLoading: isTokenLoading } = useToken(coinId)
  const { data: pool } = usePool(coinId, 362720, FeeAmount.HIGH)
  const { data: dexData } = useDexData(coinId)

  const { theme } = useTheme()

  const formatter = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 })

  const widgetConfig: WidgetConfig = {
    integrator: 'offblocks',
    fromToken: '0x0000000000000000000000000000000000000000',
    fromChain: chainId,
    toChain: chainId,
    hiddenUI: [
      'appearance',
      'language',
      'drawerCloseButton',
      'history',
      'poweredBy',
      'toAddress',
      'walletMenu',
    ],
    walletConfig: {
      onConnect: openConnectModal || (() => {}),
    },
    languages: { default: 'en' },
    appearance: theme,
    languageResources: {
      en: {
        header: { exchange: 'Swap' },
        button: { exchange: 'Swap' },
      },
    },
    theme: {
      palette: {
        primary: {
          main: theme === Theme.LIGHT ? '#171717' : '#FAFAFA',
        },
        secondary: {
          main: theme === Theme.LIGHT ? '#A6A6A6' : '#595959',
        },
        text: {
          primary: theme === Theme.LIGHT ? '#171717' : '#FAFAFA',
          secondary: theme === Theme.LIGHT ? '#A6A6A6' : '#595959',
        },
        background: {
          default: theme === Theme.LIGHT ? '#FFFFFF' : '#141414',
          paper: theme === Theme.LIGHT ? '#FFFFFF' : '#141414',
        },
      },
      shape: {
        borderRadius: 12,
      },
      container: {
        width: '24rem',
      },
      components: {
        MuiInputCard: {},
        MuiButton: {
          defaultProps: {
            disableRipple: true,
            disableTouchRipple: true,
          },
          styleOverrides: {
            root: {
              ':hover': {
                transform: 'scale(1.025)',
                backgroundColor: theme === Theme.LIGHT ? '#171717' : '#FAFAFA',
              },
              ':active': {
                transform: 'scale(0.95)',
                backgroundColor: theme === Theme.LIGHT ? '#171717' : '#FAFAFA',
              },
              transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              '&.MuiLoadingButton-root': {
                transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              },
            },
          },
        },
      },
      typography: {
        fontFamily: [
          'SFRounded',
          'ui-rounded',
          'SF Pro Rounded',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
        ].join(','),
      },
    },
  }

  return (
    <div className="flex flex-col items-center xl:flex-row">
      {isTokenLoading ? (
        <div className="h-min min-w-80 flex-col gap-4 xl:h-[80svh]">
          <Loading />
        </div>
      ) : (
        <div className="flex h-min w-80 flex-col gap-4 xl:h-[80svh]">
          <div className=" flex w-80 flex-row items-center gap-4 rounded-md bg-card px-6 py-4 text-card-foreground">
            <div className="flex w-32 flex-col gap-2">
              <Typography variant="regularText">{token?.name}</Typography>
              <Typography variant="mutedText">{token?.symbol}</Typography>
              <div className="flex flex-row gap-1">
                {token?.metadata.telegram && (
                  <a
                    className="transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                    href={`https://t.me/${token.metadata.telegram.substring(1)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TelegramIcon className="h-6 w-6" />
                  </a>
                )}
                {token?.metadata.twitter && (
                  <a
                    className="transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                    href={`https://twitter.com/${token.metadata.twitter.substring(1)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TwitterIcon className="h-6 w-6" />
                  </a>
                )}
                {token?.metadata.website && (
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
                src={token?.avatar}
                alt={token?.name}
              />
            </div>
          </div>
          <div className="flex w-80 flex-col gap-4 rounded-md bg-card px-6 text-card-foreground">
            {token && (
              <>
                <Typography variant="regularText">{token.description}</Typography>
                <div className="flex flex-row items-center gap-2">
                  <Typography variant="regularText">
                    {t('coin:metadata.totalSupply.label')}
                  </Typography>
                  <div className="grow"></div>
                  <Typography variant="mutedText">{token.totalSupply.toLocaleString()}</Typography>
                </div>
                {dexData && (
                  <>
                    <div className="flex flex-row items-center gap-0">
                      <Typography variant="regularText">
                        {t('coin:metadata.liquidity.label')}
                      </Typography>
                      <div className="grow"></div>
                      <Typography variant="mutedText">
                        {`$${formatter.format(dexData.liquidity.usd)}`}
                      </Typography>
                      <LockIcon className="h-3.5 w-3.5 fill-muted-foreground" />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <Typography variant="regularText">
                        {t('coin:metadata.marketCap.label')}
                      </Typography>
                      <div className="grow"></div>
                      <Typography variant="mutedText">
                        {`$${formatter.format(dexData.marketCap)}`}
                      </Typography>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                      <Typography variant="regularText">
                        {t('coin:metadata.volume.label')}
                      </Typography>
                      <div className="grow"></div>
                      <Typography variant="mutedText">
                        {`$${formatter.format(dexData.volume.h24)}`}
                      </Typography>
                    </div>
                  </>
                )}
                <div className="flex flex-row items-center gap-1">
                  {token.symbol}
                  <div className="grow"></div>
                  <a
                    href={`https://base.blockscout.com/address/${coinId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Typography variant="mutedText">{truncateEthAddress(coinId)}</Typography>
                  </a>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger>
                      <button
                        data-tooltip-target="tooltip-click"
                        data-tooltip-trigger="click"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                        onClick={() => {
                          navigator.clipboard.writeText(coinId)
                          toast.success(t('global:copied'))
                        }}
                      >
                        <ClipboardIcon className="h-4 w-4 fill-primary-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{t('global:copy')}</TooltipContent>
                  </Tooltip>
                  {token && (
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger>
                        <button
                          data-tooltip-target="tooltip-click"
                          data-tooltip-trigger="click"
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                          onClick={() => {
                            addToMetamask(
                              coinId,
                              token.symbol,
                              token.decimals,
                              token.avatar,
                              chainId,
                            ).catch((error) => {
                              showError(error)
                            })
                          }}
                        >
                          <MetamaskIcon className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{t('global:metamask')}</TooltipContent>
                    </Tooltip>
                  )}
                </div>
                {pool && (
                  <div className="flex flex-row items-center gap-2">
                    {t('coin:metadata.pair.label')}
                    <div className="grow"></div>
                    <a
                      href={`https://base.blockscout.com/address/${pool.address}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Typography variant="mutedText">
                        {truncateEthAddress(pool.address)}
                      </Typography>
                    </a>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger>
                        <button
                          data-tooltip-target="tooltip-click"
                          data-tooltip-trigger="click"
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                          onClick={() => {
                            navigator.clipboard.writeText(pool.address)
                            toast.success(t('global:copied'))
                          }}
                        >
                          <ClipboardIcon className="h-4 w-4 fill-primary-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{t('global:copy')}</TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </>
            )}
          </div>
          {pool && (
            <div className="flex w-80 flex-col gap-4 rounded-md bg-card px-6 text-card-foreground">
              <Card className="p-2">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center gap-2">
                    <EthRoundIcon className="h-6 w-6" />
                    <Typography variant="mutedText">ETH</Typography>
                    <div className="grow"></div>
                    <Typography variant="mutedText">
                      {(pool.token0 === coinId ? pool.fees.token1 : pool.fees.token0).toFixed(3)}
                    </Typography>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <img
                      className="aspect-square h-6 w-6 rounded-full object-cover"
                      src={token?.avatar}
                      alt={token?.name}
                    />
                    <Typography variant="mutedText">{token?.symbol}</Typography>
                    <div className="grow"></div>
                    <Typography variant="mutedText">
                      {formatter.format(
                        pool.token0 === coinId ? pool.fees.token0 : pool.fees.token1,
                      )}
                    </Typography>
                  </div>
                </div>
              </Card>
              <Button variant="default" size="default" onClick={() => {}}>
                Claim Fees
              </Button>
            </div>
          )}
        </div>
      )}
      <div className="flex h-[80svh] w-full flex-row items-center xl:h-[80svh]">
        <div className="h-full w-full ">
          {pool && (
            <iframe
              title={`${token?.name} Price Chart`}
              className="h-full w-full"
              src={`https://www.dextools.io/widget-chart/en/base/pe-light/${pool}?theme=${theme}&chartType=1&chartResolution=15&drawingToolbars=false&headerColor=${theme === Theme.DARK ? '141414' : 'FFFFFF'}&tvPlatformColor=${theme === Theme.DARK ? '141414' : 'FFFFFF'}&tvPaneColor=${theme === Theme.DARK ? '141414' : 'FFFFFF'}`}
            ></iframe>
          )}
          {!pool && <Loading />}
        </div>
      </div>
      <div className="h-min w-96 xl:h-[80svh]">
        {token && (
          <LiFiWidget
            integrator="offblocks"
            config={{
              ...widgetConfig,
              toToken: token.symbol,
              tokens: {
                featured: [
                  {
                    address: coinId,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    chainId: chainId,
                    name: token.name,
                    logoURI: token.avatar,
                  },
                ],
                include: [
                  {
                    address: coinId,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    chainId: chainId,
                    name: token.name,
                    logoURI: token.avatar,
                    priceUSD: '',
                  },
                ],
              },
            }}
          />
        )}
        {!token && (
          <div className="h-full w-96">
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}

export default CoinDetails
