import { Form, Typography } from '@/common/components'
import { zodResolver } from '@hookform/resolvers/zod'

import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { NewCoinFields, useNewCoinValidation } from '../hooks/validations'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormExtraLabel,
  FormMessage,
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useCallback, useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from '@/common/components/ui/accordion'
import { Slider } from '@/common/components/ui/slider'
import { Textarea } from '@/common/components/ui/textarea'
import { InputGroup, InputGroupInput, InputGroupText } from '@/common/components/ui/input-group'
import { Button } from '@/common/components/ui/button'
import { Card, CardHeader } from '@/common/components/ui/card'
import { useWallet } from '@/app/providers/Wallet'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useShowError } from '@/common/hooks/usePrintErrorMessage'

const NewCoin = () => {
  const { t } = useTranslation()
  const showError = useShowError()

  const { data: wallet } = useWallet()
  const { openConnectModal } = useConnectModal()

  const form = useForm<NewCoinFields>({
    resolver: zodResolver(useNewCoinValidation()),
  })

  const [, setCurrentImage] = useState<File>()
  const [previewImage, setPreviewImage] = useState<string>('')

  const handleAvatarChange = (fileList: FileList) => {
    if (fileList.length === 1) {
      setCurrentImage(fileList[0])
      console.log(fileList[0]!)
      setPreviewImage(URL.createObjectURL(fileList[0]!))
    }
  }

  const defaultLiquidity = 0
  const [liquidityPercentage, setLiquidityPercentage] = useState<number>(defaultLiquidity)

  const handleLiquiditySliderChange = (value: number[]) => {
    setLiquidityPercentage(value![0]!)
    form.setValue('liquidityPercentage', value![0]!)
  }

  const liquidityPercentageWatch = form.watch('liquidityPercentage')

  useEffect(() => {
    if (liquidityPercentageWatch !== undefined) {
      setLiquidityPercentage(liquidityPercentageWatch!)
    }
  }, [liquidityPercentageWatch])

  const liquidityValueWatch = form.watch('liquidityEthereum')

  const handleMetadataUpload = async (values: NewCoinFields) => {
    try {
      const formData = new FormData()
      formData.append('file', values.avatar[0]!)
      const metadata = JSON.stringify({
        name: '0x3339E8800Aa7233060741046650797B8723A2954',
        keyvalues: {
          name: values.name,
          symbol: values.symbol,
          description: values.description,
          twitter: values.twitter,
          telegram: values.telegram,
          website: values.website,
        },
      })
      formData.append('pinataMetadata', metadata)

      const options = JSON.stringify({
        cidVersion: 0,
      })
      formData.append('pinataOptions', options)

      await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: formData,
      })
    } catch (error) {
      showError(error)
    }
  }

  const onSubmit = useCallback(async (values: NewCoinFields) => {
    try {
      await handleMetadataUpload(values)
    } catch (error) {
      showError(error)
    }
  }, [])

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <aside className="w-11/12 space-y-4 sm:w-11/12 md:w-9/12 lg:w-3/5 xl:w-2/5">
        <Typography variant="h3">{t('coin:new.title')}</Typography>

        <Form form={form} onSubmit={onSubmit} id="new-coin-form">
          {{
            formFields: (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('coin:metadata.name.label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('coin:metadata.name.placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('coin:metadata.symbol.label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('coin:metadata.symbol.placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('coin:metadata.description.label')}</FormLabel>
                      <FormExtraLabel>{t('coin:metadata.description.extra')}</FormExtraLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('coin:metadata.description.placeholder')}
                          maxLength={140}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalSupply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('coin:metadata.totalSupply.label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t('coin:metadata.totalSupply.placeholder')}
                          step={1}
                          min={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>{t('coin:metadata.image.label')}</FormLabel>
                      <FormExtraLabel>{t('coin:metadata.image.extra')}</FormExtraLabel>
                      <FormControl>
                        <>
                          <Input
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={(event) => {
                              if (event?.target?.files) {
                                handleAvatarChange(event?.target?.files)
                              }
                              onChange(event?.target?.files ?? '')
                            }}
                            className="pl-0"
                            {...field}
                          />
                          {previewImage && (
                            <div className="flex flex-col items-center">
                              <img
                                className="aspect-square h-32 w-32 rounded-full object-cover"
                                src={previewImage}
                                alt={t('coin:metadata.image.preview')}
                              />
                            </div>
                          )}
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Accordion type="multiple">
                  <AccordionItem value="socials">
                    <AccordionHeader>
                      {t('coin:new.socials.title')}
                      <span className="ml-4 text-muted-foreground">
                        {t('coin:new.socials.extra')}
                      </span>
                    </AccordionHeader>
                    <AccordionContent>
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('coin:socials.twitter.label')}</FormLabel>
                            <FormExtraLabel>{t('global:optional')}</FormExtraLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t('coin:socials.twitter.placeholder')}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="telegram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('coin:socials.telegram.label')}</FormLabel>
                            <FormExtraLabel>{t('global:optional')}</FormExtraLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t('coin:socials.telegram.placeholder')}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('coin:socials.website.label')}</FormLabel>
                            <FormExtraLabel>{t('global:optional')}</FormExtraLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t('coin:socials.website.placeholder')}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="liquidity">
                    <AccordionHeader>
                      {t('coin:new.liquidity.title')}
                      <span className="ml-4 text-muted-foreground">
                        {t('coin:new.liquidity.extra')}
                      </span>
                    </AccordionHeader>
                    <AccordionContent>
                      <FormField
                        control={form.control}
                        name="liquidityPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('coin:liquidity.lp.label')}</FormLabel>
                            <FormExtraLabel>{t('coin:liquidity.lp.extra')}</FormExtraLabel>
                            <FormControl>
                              <div className="flex w-full flex-row items-center justify-center space-x-2">
                                <Slider
                                  step={5}
                                  defaultValue={[defaultLiquidity]}
                                  className="w-11/12"
                                  value={[liquidityPercentage]}
                                  onValueChange={handleLiquiditySliderChange}
                                />
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  step={5}
                                  className="w-max"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="liquidityEthereum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('coin:liquidity.lpEth.label')}</FormLabel>
                            <FormControl>
                              <InputGroup>
                                <InputGroupText>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    version="1.1"
                                    shape-rendering="geometricPrecision"
                                    text-rendering="geometricPrecision"
                                    image-rendering="optimizeQuality"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    viewBox="0 0 784.37 1277.39"
                                    className="h-5 w-5"
                                  >
                                    <g id="Layer_x0020_1">
                                      <metadata id="CorelCorpID_0Corel-Layer" />
                                      <g id="_1421394342400">
                                        <g>
                                          <polygon
                                            fill="#343434"
                                            fill-rule="nonzero"
                                            points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
                                          />
                                          <polygon
                                            fill="#8C8C8C"
                                            fill-rule="nonzero"
                                            points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
                                          />
                                          <polygon
                                            fill="#3C3C3B"
                                            fill-rule="nonzero"
                                            points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
                                          />
                                          <polygon
                                            fill="#8C8C8C"
                                            fill-rule="nonzero"
                                            points="392.07,1277.38 392.07,956.52 -0,724.89 "
                                          />
                                          <polygon
                                            fill="#141414"
                                            fill-rule="nonzero"
                                            points="392.07,882.29 784.13,650.54 392.07,472.33 "
                                          />
                                          <polygon
                                            fill="#393939"
                                            fill-rule="nonzero"
                                            points="0,650.54 392.07,882.29 392.07,472.33 "
                                          />
                                        </g>
                                      </g>
                                    </g>
                                  </svg>
                                </InputGroupText>
                                <InputGroupInput
                                  type="number"
                                  min={0}
                                  step={0.0001}
                                  disabled={
                                    liquidityPercentageWatch === undefined ||
                                    liquidityPercentageWatch === 0
                                  }
                                  {...field}
                                />
                                <InputGroupText>ETH</InputGroupText>
                              </InputGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="firstTrade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('coin:liquidity.firstTrade.label')}</FormLabel>
                            <FormExtraLabel>{t('coin:liquidity.firstTrade.extra')}</FormExtraLabel>
                            <FormControl>
                              <InputGroup>
                                <InputGroupText>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    version="1.1"
                                    shape-rendering="geometricPrecision"
                                    text-rendering="geometricPrecision"
                                    image-rendering="optimizeQuality"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    viewBox="0 0 784.37 1277.39"
                                    className="h-5 w-5"
                                  >
                                    <g id="Layer_x0020_1">
                                      <metadata id="CorelCorpID_0Corel-Layer" />
                                      <g id="_1421394342400">
                                        <g>
                                          <polygon
                                            fill="#343434"
                                            fill-rule="nonzero"
                                            points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
                                          />
                                          <polygon
                                            fill="#8C8C8C"
                                            fill-rule="nonzero"
                                            points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
                                          />
                                          <polygon
                                            fill="#3C3C3B"
                                            fill-rule="nonzero"
                                            points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
                                          />
                                          <polygon
                                            fill="#8C8C8C"
                                            fill-rule="nonzero"
                                            points="392.07,1277.38 392.07,956.52 -0,724.89 "
                                          />
                                          <polygon
                                            fill="#141414"
                                            fill-rule="nonzero"
                                            points="392.07,882.29 784.13,650.54 392.07,472.33 "
                                          />
                                          <polygon
                                            fill="#393939"
                                            fill-rule="nonzero"
                                            points="0,650.54 392.07,882.29 392.07,472.33 "
                                          />
                                        </g>
                                      </g>
                                    </g>
                                  </svg>
                                </InputGroupText>
                                <InputGroupInput
                                  type="number"
                                  min={0}
                                  step={0.0001}
                                  disabled={
                                    liquidityValueWatch === undefined || liquidityValueWatch === 0
                                  }
                                  {...field}
                                />
                                <InputGroupText>ETH</InputGroupText>
                              </InputGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            ),
            footer: (
              <div className="space-y-4">
                {wallet && (
                  <Button form="new-coin-form" type="submit" block>
                    {t('coin:new.submit')}
                  </Button>
                )}
                {!wallet && (
                  <Button type="button" onClick={openConnectModal} block>
                    {t('wallet:connect')}
                  </Button>
                )}
                <Card>
                  <CardHeader>
                    <Typography variant="regularText">{t('coin:new.cost', { cost: 0 })}</Typography>
                  </CardHeader>
                  {/* <CardContent>
                    <Stepper>
                      <StepperStep index={0}>
                        <StepperStepContent>{t('coin:new.steps.token')}</StepperStepContent>
                      </StepperStep>
                      {form.getValues('liquidityPercentage') !== undefined &&
                        form.getValues('liquidityPercentage')! > 0 && (
                          <StepperStep index={1}>
                            <StepperStepContent>
                              {t('coin:new.steps.initLiquidity')}
                            </StepperStepContent>
                          </StepperStep>
                        )}
                      {form.getValues('liquidityPercentage') !== undefined &&
                        form.getValues('liquidityPercentage')! > 0 && (
                          <StepperStep index={2}>
                            <StepperStepContent>
                              {t('coin:new.steps.approveLiquidity')}
                            </StepperStepContent>
                          </StepperStep>
                        )}
                      {form.getValues('firstTrade') !== undefined &&
                        form.getValues('firstTrade') !== 0 && (
                          <StepperStep index={3}>
                            <StepperStepContent>
                              {t('coin:new.steps.approveSwap')}
                            </StepperStepContent>
                          </StepperStep>
                        )}
                    </Stepper>
                  </CardContent> */}
                </Card>
              </div>
            ),
          }}
        </Form>
      </aside>
    </div>
  )
}

export default NewCoin
