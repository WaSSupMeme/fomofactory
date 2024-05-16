import { z } from 'zod'

const txnsSchema = z.object({
  buys: z.number(),
  sells: z.number(),
})

const dexDataSchema = z.object({
  address: z.custom<`0x${string}`>(),
  txns: z.object({
    m5: txnsSchema,
    h1: txnsSchema,
    h6: txnsSchema,
    h24: txnsSchema,
  }),
  volume: z.object({
    m5: z.number(),
    h1: z.number(),
    h6: z.number(),
    h24: z.number(),
  }),
  liquidity: z.object({
    usd: z.number(),
    base: z.number(),
    quote: z.number(),
  }),
  marketCap: z.number(),
})

export type DexData = z.infer<typeof dexDataSchema>
