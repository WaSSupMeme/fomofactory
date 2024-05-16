import { z } from 'zod'

const tokenSchema = z.object({
  address: z.custom<`0x${string}`>(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  totalSupply: z.number(),
  avatar: z.string(),
  description: z.string(),
  metadata: z.object({
    twitter: z.string().optional(),
    telegram: z.string().optional(),
    website: z.string().optional(),
  }),
})

export type Token = z.infer<typeof tokenSchema>
