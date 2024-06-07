import { ConnectButton as ThirdwebConnectButton, useActiveWallet, useConnect } from 'thirdweb/react'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import { cn } from '@/common/styleUtils'
import { CoinbaseIcon } from '@/assets/svg/CoinbaseIcon'
import { useWagmiAdapter } from '@/app/providers/Wallet'
import { createWallet } from 'thirdweb/wallets'

const GRADIENT_BORDER_WIDTH = 2

const Gradient = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, style }, ref) => {
    return (
      <div ref={ref} className="relative">
        <div
          style={{
            background:
              'conic-gradient(from 180deg, #79dbd2, #45e1e5, #0052ff, #b82ea4, #ff9533, #7fd057)',
            ...style,
          }}
          className={cn(
            className,
            'group-hover:duration-2000 group-hover:ease-in-rotate group-hover:rotate-[720deg]',
          )}
        />
        {children}
      </div>
    )
  },
)

interface CreateWalletButtonProps {
  label: string
}

const CreateWalletButton = ({ label }: CreateWalletButtonProps) => {
  const { connect } = useConnect()
  const { client, chain } = useWagmiAdapter()
  const buttonRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (buttonRef.current) {
      setDimensions({
        width: buttonRef.current.offsetWidth,
        height: buttonRef.current.offsetHeight,
      })
    }
  }, [])

  const [gradientDiameter, setGradientDiameter] = useState(0)
  useLayoutEffect(() => {
    setGradientDiameter(Math.max(dimensions.height, dimensions.width))
  }, [dimensions])

  const styles = useMemo(
    () => ({
      gradientContainer: {
        borderRadius: dimensions.height / 2,
        height: dimensions.height,
        width: dimensions.width,
      },
      gradient: {
        height: gradientDiameter,
        width: gradientDiameter,
        top: -(gradientDiameter / 2) + dimensions.height / 2 - GRADIENT_BORDER_WIDTH,
        left: -GRADIENT_BORDER_WIDTH,
      },
      buttonBody: {
        height: dimensions.height - GRADIENT_BORDER_WIDTH * 2,
        width: dimensions.width - GRADIENT_BORDER_WIDTH * 2,
        borderRadius: dimensions.height / 2,
      },
    }),
    [dimensions, gradientDiameter],
  )

  const connectWallet = async () => {
    await connect(async () => {
      const coinbaseWallet = createWallet('com.coinbase.wallet')
      await coinbaseWallet.connect({ client, chain })
      return coinbaseWallet
    })
  }

  return (
    <Button
      variant="default"
      size="default"
      onClick={connectWallet}
      className="border-1 box-border rounded-none border-solid border-transparent bg-transparent px-0 py-0 shadow-none"
    >
      <div
        style={styles.gradientContainer}
        className={cn(
          'group box-border flex items-center justify-center overflow-hidden bg-background',
        )}
      >
        <Gradient style={styles.gradient} className="absolute">
          <div
            ref={buttonRef}
            style={styles.buttonBody}
            className="relative box-border flex items-center justify-center gap-1 bg-background px-4 py-2 text-foreground"
          >
            <CoinbaseIcon className="h-6 w-6 fill-foreground" />
            {label}
          </div>
        </Gradient>
      </div>
    </Button>
  )
}

const ConnectButton = () => {
  const { t } = useTranslation()
  const wallet = useActiveWallet()

  const { client, chain } = useWagmiAdapter()

  return (
    <div data-rk className="flex flex-row gap-2">
      {!wallet && <CreateWalletButton label={t('wallet:create')} />}
      {client && (
        <ThirdwebConnectButton
          client={client}
          appMetadata={{ name: import.meta.env.VITE_APP_NAME }}
          connectModal={{
            titleIcon: '',
            termsOfServiceUrl: 'https://fomofactory.wtf/tos',
            showThirdwebBranding: false,
          }}
          chain={chain}
          chains={[chain]}
          onConnect={(w) => console.log(w)}
        />
      )}
    </div>
  )
}

export default ConnectButton
