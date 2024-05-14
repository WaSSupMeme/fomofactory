// Captures 0x + 4 characters, then the last 6 characters.
const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{6})$/

/**
 * Truncates an ethereum address to the format 0x0000…000000
 * @param address Full address to truncate
 * @returns Truncated address
 */
const truncateEthAddress = (address: string) => {
  const match = address.match(truncateRegex)
  if (!match) return address
  return `${match[1]}…${match[2]}`
}

async function addToMetamask(
  address: `0x${string}`,
  symbol: string,
  decimals: number,
  image: string,
  chainId: number,
) {
  if (window.ethereum.networkVersion !== chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (err: any) {
      throw err
    }
  }
  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: address,
          symbol: symbol,
          decimals: decimals,
          image: image,
        },
      },
    })
  } catch (error) {
    throw error
  }
}

export { truncateEthAddress, addToMetamask }
