import {
  Address,
  BlockTag,
  createClient,
  Hex,
  http,
  decodeAbiParameters,
  decodeFunctionData,
  createPublicClient,
} from 'viem'
import { base } from 'viem/chains'
import { ENTRYPOINT_ADDRESS_V06, UserOperation } from 'permissionless'
import { paymasterActionsEip7677 } from 'permissionless/experimental'
import { coinbaseSmartWalletAbi } from '@/client/abi/generated'

import { NextFunction, type Request, type Response } from 'express'

const willSponsor = async ({
  chainId,
  entrypoint,
  userOp,
}: {
  chainId: number
  entrypoint: string
  userOp: UserOperation<'v0.6'>
}) => {
  // check chain id
  if (chainId !== base.id) return false
  // check entrypoint
  // not strictly needed given below check on implementation address, but leaving as example
  if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase()) return false

  try {
    const client = createPublicClient({
      chain: base,
      transport: http(),
    })

    // check the userOp.sender is a proxy with the expected bytecode
    const code = await client.getBytecode({ address: userOp.sender })

    if (!code) {
      // no code at address, check that the initCode is deploying a Coinbase Smart Wallet
      // factory address is first 20 bytes of initCode after '0x'
      const factoryAddress = userOp.initCode.slice(0, 42)
      if (
        factoryAddress.toLowerCase() !==
        import.meta.env[`VITE_COINBASE_SMART_WALLET_FACTORY_ADDRESS_${chainId}`].toLowerCase()
      )
        return false
    } else {
      // code at address, check that it is a proxy to the expected implementation
      if (code !== import.meta.env['VITE_COINBASE_SMART_WALLET_BYTECODE']) return false

      // check that userOp.sender proxies to expected implementation
      const implementation = await client.request<{
        Parameters: [Address, Hex, BlockTag]
        ReturnType: Hex
      }>({
        method: 'eth_getStorageAt',
        params: [
          userOp.sender,
          import.meta.env['VITE_ERC1967_PROXY_IMPLEMENTATION_SLOT'],
          'latest',
        ],
      })
      const implementationAddress = decodeAbiParameters([{ type: 'address' }], implementation)[0]
      if (
        implementationAddress !==
        import.meta.env[`VITE_COINBASE_SMART_WALLET_V1_INPLEMENTATION_ADDRESS_${chainId}`]
      )
        return false
    }

    // check that userOp.callData is making a call we want to sponsor
    const calldata = decodeFunctionData({
      abi: coinbaseSmartWalletAbi,
      data: userOp.callData,
    })

    // keys.coinbase.com always uses executeBatch
    if (calldata.functionName !== 'executeBatch') return false
    if (!calldata.args || !calldata.args.length) return false

    const calls = calldata.args[0] as {
      target: Address
      value: bigint
      data: Hex
    }[]
    // modify if want to allow batch calls to your contract
    if (calls.length > 2) return false

    if (calls.length > 1) {
      // if there is more than one call, check if the first is a magic spend call
      if (
        calls[0]!!.target.toLowerCase() !==
        import.meta.env[`VITE_COINBASE_MAGIC_SPEND_ADDRESS_${chainId}`].toLowerCase()
      )
        return false
    }

    return true
  } catch (e) {
    console.error(`willSponsor check failed: ${e}`)
    return false
  }
}

export const POST = async (req: Request, res: Response, _next: NextFunction) => {
  const paymasterService = import.meta.env.VITE_PAYMASTER_SERVICE_URL

  const paymasterClient = createClient({
    chain: base,
    transport: http(paymasterService),
  }).extend(paymasterActionsEip7677(ENTRYPOINT_ADDRESS_V06))

  const method = req.method
  const { userOp, entrypoint, chainId } = req.body as {
    userOp: UserOperation<'v0.6'>
    entrypoint: string
    chainId: string
  }
  if (!willSponsor({ chainId: parseInt(chainId), entrypoint, userOp })) {
    return res.json({ error: 'Not a sponsorable operation' })
  }

  if (method === 'pm_getPaymasterStubData') {
    const result = await paymasterClient.getPaymasterStubData({
      userOperation: userOp,
    })

    return res.json({ result })
  } else if (method === 'pm_getPaymasterData') {
    const result = await paymasterClient.getPaymasterData({
      userOperation: userOp,
    })
    return res.json({ result })
  }
  return res.json({ error: 'Method not found' })
}
