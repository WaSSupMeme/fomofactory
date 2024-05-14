import { Loading, Typography } from '@/common/components'

import { useTranslation } from 'react-i18next'
import { useCoinDetailsParams } from '@/app/routes'
import { useState, useEffect } from 'react'
import { erc20Abi, formatEther, zeroAddress } from 'viem'
import { useChainId, useReadContracts } from 'wagmi'
import { cn } from '@/common/styleUtils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/common/components/ui/tooltip'
import { addToMetamask, truncateEthAddress } from '@/common/utils'

import { toast } from 'sonner'

import { LiFiWidget, WidgetConfig } from '@lifi/widget'
import { Theme, useTheme } from '@/app/providers/Theme'

import IUniswapV3FactoryABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'

import { FeeAmount } from '@uniswap/v3-sdk'
import { useShowError } from '@/common/hooks/usePrintErrorMessage.js'
import { useConnectModal } from '@rainbow-me/rainbowkit'

const CoinDetails = () => {
  const { t } = useTranslation()
  const showError = useShowError()

  const { coinId } = useCoinDetailsParams()

  const { openConnectModal } = useConnectModal()
  const chainId = useChainId()

  const [token, setToken] = useState<
    { name: string; symbol: string; totalSupply: number; decimals: number } | undefined
  >()

  const { data: tokenData } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: coinId,
        abi: erc20Abi,
        functionName: 'name',
      },
      {
        address: coinId,
        abi: erc20Abi,
        functionName: 'symbol',
      },
      {
        address: coinId,
        abi: erc20Abi,
        functionName: 'totalSupply',
      },
      {
        address: coinId,
        abi: erc20Abi,
        functionName: 'decimals',
      },
    ],
  })

  const [pool, setPool] = useState<`0x${string}` | undefined>()

  const { data: poolData } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
        abi: IUniswapV3FactoryABI.abi,
        functionName: 'getPool',
        args: [coinId, '0x4200000000000000000000000000000000000006', FeeAmount.HIGH],
      },
    ],
  })

  const [metadata, setMetadata] = useState<
    | { avatar: string; description: string; telegram: string; twitter: string; website: string }
    | undefined
  >()
  const [isMetadataLoading, setIsMetadataLoading] = useState(true)

  const fetchMetadata = async () => {
    try {
      const res = await fetch(
        `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${coinId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
        },
      )
      const resData: any = await res.json()
      if (resData.rows.length > 0) {
        const avatar = resData.rows[0]
        setMetadata({
          avatar: `${import.meta.env.VITE_GATEWAY_URL}/ipfs/${avatar.ipfs_pin_hash}`,
          description: avatar.metadata.keyvalues.description,
          telegram: avatar.metadata.keyvalues.telegram,
          twitter: avatar.metadata.keyvalues.twitter,
          website: avatar.metadata.keyvalues.website,
        })
        setIsMetadataLoading(false)
      }
    } catch (error) {
      showError(error)
    }
  }

  useEffect(() => {
    if (tokenData) {
      setToken({
        name: tokenData[0] as string,
        symbol: tokenData[1] as string,
        totalSupply: Number(formatEther(tokenData[2])),
        decimals: tokenData[3] as number,
      })
      fetchMetadata()
    }
  }, [tokenData])

  useEffect(() => {
    if (poolData && poolData[0] !== zeroAddress) {
      setPool(poolData[0] as `0x${string}`)
    }
  }, [poolData])

  const { theme } = useTheme()

  const widgetConfig: WidgetConfig = {
    integrator: 'offblocks',
    fromToken: '0x0000000000000000000000000000000000000000',
    fromChain: chainId,
    toChain: chainId,
    disabledUI: ['toToken'],
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
        header: { exchange: 'Buy' },
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
      <div className="flex h-min w-80 flex-col gap-4 xl:h-[70svh]">
        <div className=" flex w-80 flex-row items-center gap-4 rounded-md bg-card px-6 py-4 text-card-foreground">
          <div className="flex w-32 flex-col gap-2">
            <Typography variant="regularText">{token?.name}</Typography>
            <Typography variant="mutedText">{token?.symbol}</Typography>
            <div className="flex flex-row gap-1">
              {metadata?.telegram && (
                <a
                  className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                  href={`https://t.me/${metadata.telegram.substring(1)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 240 240"
                  >
                    <defs>
                      <linearGradient
                        id="linear-gradient"
                        x1="120"
                        y1="240"
                        x2="120"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0" stop-color="#1d93d2" />
                        <stop offset="1" stop-color="#38b0e3" />
                      </linearGradient>
                    </defs>
                    <circle cx="120" cy="120" r="120" fill="url(#linear-gradient)" />
                    <path
                      d="M81.229,128.772l14.237,39.406s1.78,3.687,3.686,3.687,30.255-29.492,30.255-29.492l31.525-60.89L81.737,118.6Z"
                      fill="#c8daea"
                    />
                    <path
                      d="M100.106,138.878l-2.733,29.046s-1.144,8.9,7.754,0,17.415-15.763,17.415-15.763"
                      fill="#a9c6d8"
                    />
                    <path
                      d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z"
                      fill="#fff"
                    />
                  </svg>
                </a>
              )}
              {metadata?.twitter && (
                <a
                  className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                  href={`https://twitter.com/${metadata.twitter.substring(1)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 512 512"
                    shape-rendering="geometricPrecision"
                    text-rendering="geometricPrecision"
                    image-rendering="optimizeQuality"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M256 0c141.385 0 256 114.615 256 256S397.385 512 256 512 0 397.385 0 256 114.615 0 256 0z" />
                    <path
                      fill="#fff"
                      fill-rule="nonzero"
                      d="M 346.648 113.564 L 394.982 113.564 L 289.381 234.235 L 413.616 398.436 L 316.338 398.436 L 240.152 298.845 L 152.976 398.436 L 104.609 398.436 L 217.559 269.367 L 98.383 113.564 L 198.124 113.564 L 266.993 204.59 L 346.648 113.564 Z M 329.682 369.51 L 356.467 369.51 L 183.572 140.971 L 154.832 140.971 L 329.682 369.51 Z"
                    />
                  </svg>
                </a>
              )}
              {metadata?.website && (
                <a
                  className="transition duration-300 ease-in-out hover:scale-105 active:scale-95 "
                  href={metadata.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className={cn('h-6 w-6', 'fill-primary')}
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 256 256"
                    enable-background="new 0 0 256 256"
                  >
                    <g>
                      <g>
                        <g>
                          <path d="M118.9,10.2C108.1,11.3,99.7,13,91,15.9C55.4,27.6,27.4,55.6,15.7,91.1C11.5,104,10,113.8,10,128.3c0,11.8,0.8,18.8,3.4,28.8c4.1,16,12.4,32.5,22.9,45.5c4.2,5.3,12.6,13.6,17.9,17.7c12.7,10.2,29,18.2,44.7,22.2c10.1,2.5,17.1,3.4,28.8,3.4c11.1,0,14.7-0.3,24.6-2.3c16.9-3.4,35.8-12.3,49.7-23.6c5.6-4.6,13.8-12.8,18.3-18.4c10-12.5,18.1-28.9,22.1-44.5c10.2-40.7-1.4-83-31-112.6c-18.3-18.3-40.6-29.4-66.9-33.5C139.8,10.4,122.9,9.8,118.9,10.2z M119.6,53.3V76l-2.4-0.3c-7.8-0.9-13.2-1.8-17.6-2.8c-5.9-1.3-12.7-3.4-12.7-3.8c0-0.6,4.4-8.4,6.9-12.1c5.7-8.6,14.1-17.8,21.5-23.5c2-1.5,3.8-2.8,4.1-2.8C119.4,30.7,119.6,40.9,119.6,53.3z M140.1,33.1c7.4,5.5,16.2,15.1,22,24c2.4,3.7,6.8,11.5,6.8,12.1c0,0.4-6.9,2.4-12.7,3.8c-4.5,1-9.9,1.8-17.6,2.8l-2.4,0.3V53.3c0-12.4,0.1-22.6,0.4-22.6C136.8,30.7,138.4,31.8,140.1,33.1z M90,34.1c0,0.1-1.4,1.8-3,3.8c-3.8,4.6-9,12.4-12.6,18.8c-1.5,2.8-2.9,5.3-3,5.5c-0.2,0.6-4.1-1.6-9.5-5.1c-4.5-3-4.7-2.4,2-7.8c6.9-5.6,15-10.6,22.2-13.8C90.1,33.8,90,33.8,90,34.1z M173.3,37.4c6.3,3.1,14,8.2,19.5,12.8c2.3,1.9,4.3,3.7,4.5,4c0.2,0.2-1.4,1.6-3.5,3c-5.5,3.6-9.3,5.7-9.5,5.1c-0.1-0.3-1.4-2.7-3-5.5c-3.6-6.5-8-13.1-11.9-17.8c-4.1-5-4.2-5.1-2.5-4.5C167.7,34.7,170.5,36,173.3,37.4z M50.7,69.6c2,1.3,5.9,3.8,8.6,5.4c2.8,1.6,5.2,3,5.3,3c0.1,0.1-0.7,3.1-1.7,6.7c-2.5,8.8-4.1,16.7-5,25.1c-0.4,3.8-0.8,7.6-0.9,8.4l-0.2,1.5h-15c-13.5,0-15-0.1-15-0.7c0-0.4,0.3-3,0.7-5.7c1.8-12.7,6-24.6,12.3-35.5c2.8-4.8,6.7-10.7,7.2-10.7C47.1,67.1,48.8,68.2,50.7,69.6z M211.8,71.2c7.1,10.5,11.6,20.7,14.6,32.7c1,4.2,2.6,13.2,2.6,15.2c0,0.6-1.5,0.7-15,0.7h-15l-0.2-1.1c-0.1-0.6-0.3-2.8-0.5-4.9c-0.6-8.7-2.6-19.2-5.7-30c-0.9-3.3-1.4-5.8-1.2-5.9c1-0.4,11.5-6.8,14.1-8.7c1.6-1.2,3-2.1,3.2-2.1C208.9,67.1,210.3,68.9,211.8,71.2z M95.2,89c5.1,1.2,15.1,2.7,21.3,3.3l3.1,0.3v13.6v13.6h-23h-23l0.2-1.8c1.2-11.4,2.6-19.7,4.8-27.6c0.8-2.7,1.5-5.1,1.6-5.3c0.1-0.2,2.4,0.4,5,1.2C87.8,87.2,92.3,88.4,95.2,89z M177.2,90.5c2.5,9,4.7,21.5,4.7,27v2.3H159h-22.8v-13.6V92.6l3.1-0.3c11-1,22.7-3.2,31.1-6c2.6-0.8,4.9-1.4,5-1.2C175.7,85.2,176.4,87.6,177.2,90.5z M57,138.3c0.1,1.1,0.4,3.4,0.5,5.2c0.8,9.7,3.5,22.7,6.9,33.3c0.3,0.9-0.1,1.2-3.3,3c-3,1.6-9.7,6-13.5,8.7c-0.7,0.6-1,0.3-2.9-2.3c-6.9-9.7-12.5-22-15.3-33.6c-1.1-4.4-2.6-13.5-2.6-15.4c0-0.6,1.5-0.7,15-0.7h15L57,138.3z M119.5,149.9l-0.1,13.5l-4.4,0.3c-9.1,0.7-19.4,2.7-29.3,5.7c-2.9,0.9-5.4,1.6-5.5,1.6c-0.1,0-0.8-2.2-1.6-5c-1.8-6.3-3.6-15.1-4.2-21.3c-0.3-2.7-0.6-5.6-0.6-6.6l-0.2-1.7h23h23L119.5,149.9z M182.1,138.1c-0.1,1-0.4,3.9-0.6,6.6c-0.6,6-2.4,14.9-4.2,21.2c-0.8,2.6-1.5,4.9-1.5,5c-0.1,0-2.6-0.6-5.5-1.5c-9.9-3-20.2-5-29.4-5.7l-4.4-0.3l-0.1-13.5l-0.1-13.5h23h23L182.1,138.1z M229,137.1c0,1.9-1.6,11-2.6,15.2c-3,12-7.5,22.2-14.6,32.7c-1.8,2.7-2.9,3.9-3.3,3.7c-0.3-0.2-2.8-1.9-5.6-3.8c-2.8-1.8-6.6-4.2-8.4-5.2c-1.8-1-3.4-1.9-3.4-2s0.5-1.8,1.2-3.8c2.6-8.3,4.8-19.3,5.8-28.5c0.3-2.8,0.6-6,0.7-7.1l0.2-1.9h15C227.5,136.4,229,136.5,229,137.1z M119.6,203.1c0,12.6-0.1,22.8-0.3,22.8c-0.9,0-8.1-6-12.7-10.6c-5.5-5.5-9.1-10-13.5-16.6c-3.4-5.3-6.9-11.9-6.5-12.1c0.7-0.4,10.1-3,13.6-3.8c5.2-1.2,14.2-2.4,16.9-2.5l2.4,0V203.1z M145.1,181c2.9,0.4,7.2,1.1,9.6,1.6c4.2,0.9,13.7,3.5,14.4,4c0.5,0.3-3.1,7-6.8,12.6c-6.1,9.4-14.2,18.2-22.1,24.1c-1.9,1.4-3.6,2.6-3.8,2.6c-0.1,0-0.3-10.3-0.3-22.8v-22.8h1.8C139,180.2,142.2,180.5,145.1,181z M73.7,198.5c3.2,6,8.8,14.5,12.8,19.5c1.7,2.1,2.9,3.8,2.6,3.8c-1.2,0-12.3-6-17.5-9.5c-5.5-3.7-13.4-10-13.4-10.8c0-0.6,11.5-7.9,12.5-7.9C70.9,193.6,72.2,195.8,73.7,198.5z M189.1,195.8c5.3,3.2,8.5,5.4,8.5,5.7c0,0.7-7.8,7-13.1,10.6c-4.9,3.3-16.6,9.6-17.8,9.6c-0.3,0,0.9-1.7,2.5-3.7c4.1-5,8.7-12,12.5-18.8c1.7-3.1,3.2-5.6,3.4-5.6C185.3,193.6,187.1,194.6,189.1,195.8z" />
                        </g>
                      </g>
                    </g>
                  </svg>
                </a>
              )}
            </div>
          </div>
          <div className="flex ">
            {isMetadataLoading && (
              <div className="aspect-square h-32 w-32 rounded-full object-cover">
                <Loading />
              </div>
            )}
            {!isMetadataLoading && metadata?.avatar && (
              <img
                className="aspect-square h-32 w-32 rounded-full object-cover"
                src={metadata?.avatar}
                alt={token?.name}
              />
            )}
          </div>
        </div>
        <div className="flex w-80 flex-col gap-4 rounded-md bg-card px-6 text-card-foreground">
          <Typography variant="regularText">{metadata?.description}</Typography>
          <div className="flex flex-row items-center gap-2">
            <a href={`https://basescan.org/address/${coinId}`} target="_blank" rel="noreferrer">
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
                  <svg
                    className="h-4 w-4 fill-primary-foreground"
                    viewBox="0 0 24 24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g stroke="none" stroke-width="1" fill-rule="evenodd">
                      <g fill-rule="nonzero">
                        <path
                          d="M5.50280381,4.62704038 L5.5,6.75 L5.5,17.2542087 C5.5,19.0491342 6.95507456,20.5042087 8.75,20.5042087 L17.3662868,20.5044622 C17.057338,21.3782241 16.2239751,22.0042087 15.2444057,22.0042087 L8.75,22.0042087 C6.12664744,22.0042087 4,19.8775613 4,17.2542087 L4,6.75 C4,5.76928848 4.62744523,4.93512464 5.50280381,4.62704038 Z M17.75,2 C18.9926407,2 20,3.00735931 20,4.25 L20,17.25 C20,18.4926407 18.9926407,19.5 17.75,19.5 L8.75,19.5 C7.50735931,19.5 6.5,18.4926407 6.5,17.25 L6.5,4.25 C6.5,3.00735931 7.50735931,2 8.75,2 L17.75,2 Z M17.75,3.5 L8.75,3.5 C8.33578644,3.5 8,3.83578644 8,4.25 L8,17.25 C8,17.6642136 8.33578644,18 8.75,18 L17.75,18 C18.1642136,18 18.5,17.6642136 18.5,17.25 L18.5,4.25 C18.5,3.83578644 18.1642136,3.5 17.75,3.5 Z"
                          id="🎨-Color"
                        ></path>
                      </g>
                    </g>
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>{t('global:copy')}</TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <button
                  data-tooltip-target="tooltip-click"
                  data-tooltip-trigger="click"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                  onClick={() => {
                    if (token && metadata) console.log(metadata!.avatar)
                    addToMetamask(
                      coinId,
                      token!.symbol,
                      token!.decimals,
                      metadata!.avatar,
                      chainId,
                    ).catch((error) => {
                      showError(error)
                    })
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 256 240"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                  >
                    <g>
                      <polygon
                        fill="#E17726"
                        points="250.066018 -8.89651791e-15 140.218553 81.2793133 160.645643 33.3787726"
                      ></polygon>
                      <polygon
                        fill="#E27625"
                        points="6.19062016 0.0955267053 95.3715526 33.38465 114.767923 81.9132784"
                      ></polygon>
                      <polygon
                        fill="#E27625"
                        points="205.859986 172.858026 254.410647 173.782023 237.442988 231.424252 178.200429 215.112736"
                      ></polygon>
                      <polygon
                        fill="#E27625"
                        points="50.1391619 172.857971 77.6964289 215.11288 18.5530579 231.425317 1.68846828 173.782036"
                      ></polygon>
                      <polygon
                        fill="#E27625"
                        points="112.130724 69.5516472 114.115388 133.635085 54.744344 130.933905 71.6319541 105.456448 71.8456974 105.210668"
                      ></polygon>
                      <polygon
                        fill="#E27625"
                        points="143.254237 68.8369186 184.153999 105.213392 184.365514 105.45719 201.253537 130.934656 141.89632 133.635226"
                      ></polygon>
                      <polygon
                        fill="#E27625"
                        points="79.4347776 173.043957 111.853145 198.302774 74.1951401 216.484384"
                      ></polygon>
                      <polygon
                        fill="#E27625"
                        points="176.57078 173.040009 181.701672 216.484523 144.149363 198.301203"
                      ></polygon>
                      <polygon
                        fill="#D5BFB2"
                        points="144.977922 195.921642 183.084879 214.373531 147.637779 231.220354 148.005818 220.085704"
                      ></polygon>
                      <polygon
                        fill="#D5BFB2"
                        points="111.01133 195.929982 108.102093 219.90359 108.340838 231.207237 72.8105145 214.373665"
                      ></polygon>
                      <polygon
                        fill="#233447"
                        points="100.007166 141.998856 109.965172 162.926822 76.0615945 152.995277"
                      ></polygon>
                      <polygon
                        fill="#233447"
                        points="155.991579 142.000941 180.049716 152.994594 146.03608 162.923638"
                      ></polygon>
                      <polygon
                        fill="#CC6228"
                        points="82.0263962 172.830401 76.5459821 217.870023 47.1731221 173.814952"
                      ></polygon>
                      <polygon
                        fill="#CC6228"
                        points="173.976111 172.8305 208.830462 173.815081 179.347016 217.871514"
                      ></polygon>
                      <polygon
                        fill="#CC6228"
                        points="202.112267 128.387342 176.746779 154.238424 157.190334 145.301352 147.82685 164.985265 141.688645 131.136429"
                      ></polygon>
                      <polygon
                        fill="#CC6228"
                        points="53.8753865 128.386879 114.309585 131.136429 108.17138 164.985265 98.8061425 145.303856 79.3525107 154.238823"
                      ></polygon>
                      <polygon
                        fill="#E27525"
                        points="52.165606 123.082486 80.8639084 152.203386 81.8584812 180.952278"
                      ></polygon>
                      <polygon
                        fill="#E27525"
                        points="203.863346 123.029784 174.117491 181.003017 175.237428 152.202737"
                      ></polygon>
                      <polygon
                        fill="#E27525"
                        points="112.906762 124.855691 114.061658 132.125682 116.915771 150.236518 115.080954 205.861884 106.405804 161.177486 106.402953 160.71542"
                      ></polygon>
                      <polygon
                        fill="#E27525"
                        points="143.077997 124.755417 149.599051 160.715451 149.596194 161.177486 140.899333 205.973714 140.55515 194.76913 139.198167 149.907127"
                      ></polygon>
                      <polygon
                        fill="#F5841F"
                        points="177.788479 151.045975 176.81718 176.023897 146.543342 199.61119 140.4233 195.28712 147.283427 159.951634"
                      ></polygon>
                      <polygon
                        fill="#F5841F"
                        points="78.3167053 151.046455 108.716464 159.952427 115.576437 195.28712 109.456385 199.611197 79.1807344 176.021881"
                      ></polygon>
                      <polygon
                        fill="#C0AC9D"
                        points="67.0180978 208.857597 105.750143 227.209502 105.586194 219.372868 108.826835 216.528328 147.160694 216.528328 150.518758 219.363342 150.271375 227.194477 188.757733 208.903978 170.030292 224.379509 147.384611 239.933315 108.516484 239.933315 85.8855503 224.315941"
                      ></polygon>
                      <polygon
                        fill="#161616"
                        points="142.203502 193.479367 147.679764 197.347701 150.888964 222.952494 146.244706 219.030957 109.769299 219.030957 105.213447 223.031398 108.317268 197.349663 113.795429 193.479367"
                      ></polygon>
                      <polygon
                        fill="#763E1A"
                        points="242.814251 2.24978946 256 41.8072765 247.765337 81.803692 253.629038 86.3274221 245.694407 92.3812097 251.657525 96.9865879 243.761206 104.178247 248.609106 107.688972 235.743366 122.714803 182.973386 107.350364 182.516079 107.105244 144.488982 75.0267414"
                      ></polygon>
                      <polygon
                        fill="#763E1A"
                        points="13.1860054 2.24978557 111.51151 75.0267402 73.4844118 107.105244 73.0271023 107.350365 20.2567388 122.714804 7.39121291 107.688927 12.2352706 104.180751 4.34251001 96.9865923 10.2945566 92.3862179 2.24133703 86.315099 8.32629691 81.7886671 -8.89651791e-15 41.8087534"
                      ></polygon>
                      <polygon
                        fill="#F5841F"
                        points="180.391638 103.990363 236.304873 120.269177 254.470245 176.254719 206.546445 176.25462 173.525532 176.671282 197.539657 129.863284"
                      ></polygon>
                      <polygon
                        fill="#F5841F"
                        points="75.6080363 103.990376 58.4568191 129.863284 82.4741865 176.671282 49.4693913 176.254719 1.63053271 176.254719 19.6938968 120.269548"
                      ></polygon>
                      <polygon
                        fill="#F5841F"
                        points="163.383898 33.1117385 147.744691 75.3505047 144.425852 132.411352 143.155934 150.295986 143.055195 195.983514 112.943788 195.983514 112.846176 150.381702 111.572114 132.395585 108.251786 75.3505047 92.6150854 33.1117385"
                      ></polygon>
                    </g>
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>{t('global:metamask')}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="flex h-[70svh] w-full flex-row items-center xl:h-[70svh]">
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
      <div className="h-min w-96 xl:h-[70svh]">
        {token && metadata && (
          <LiFiWidget
            integrator="offblocks"
            config={{
              ...widgetConfig,
              toToken: token!.symbol,
              tokens: {
                featured: [
                  {
                    address: coinId,
                    symbol: token!.symbol,
                    decimals: token!.decimals,
                    chainId: chainId,
                    name: token!.name,
                    logoURI: metadata!.avatar,
                  },
                ],
                include: [
                  {
                    address: coinId,
                    symbol: token!.symbol,
                    decimals: token!.decimals,
                    chainId: chainId,
                    name: token!.name,
                    logoURI: metadata!.avatar,
                    priceUSD: '',
                  },
                ],
              },
            }}
          />
        )}
        {!(token && metadata) && (
          <div className="h-full w-96">
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}

export default CoinDetails
