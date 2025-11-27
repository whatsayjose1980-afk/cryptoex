// Token Contract Addresses and Canonical Data
// Fetches token symbols and decimals from canonical contract addresses

export interface TokenContractData {
  address: string
  symbol: string
  name: string
  decimals: number
  chainId: number
  chainName: string
}

// Canonical token contract addresses across different networks
export const TOKEN_CONTRACTS: Record<string, Record<number, string>> = {
  // Ethereum (Chain ID: 1)
  ETH: {
    1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  },
  USDT: {
    1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum
    56: '0x55d398326f99059fF775485246999027B3197955', // BSC
    137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon
    42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // Arbitrum
    10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', // Optimism
    8453: '0x833589fCD6eDb6E08f4c7C32D4f71b1566469c3d', // Base
    43114: '0x9702230A8657203E2D02ACE3e48B60342F134467', // Avalanche
  },
  USDC: {
    1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Ethereum
    56: '0x8AC76a51cc950d9822D68b83FE1Ad97B32Cd580d', // BSC
    137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // Polygon
    42161: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5F86', // Arbitrum
    10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // Optimism
    8453: '0x833589fCD6eDb6E08f4c7C32D4f71b1566469c3d', // Base
    43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // Avalanche
  },
  USDTz: {
    1: '0xB537A89b71F34985433d3A3E17A0824F1e30FD17', // Ethereum (Source)
    56: '0xB537A89b71F34985433d3A3E17A0824F1e30FD17', // BSC
    137: '0xB537A89b71F34985433d3A3E17A0824F1e30FD17', // Polygon
    42161: '0xB537A89b71F34985433d3A3E17A0824F1e30FD17', // Arbitrum
    10: '0xB537A89b71F34985433d3A3E17A0824F1e30FD17', // Optimism
    8453: '0xB537A89b71F34985433d3A3E17A0824F1e30FD17', // Base
    43114: '0xB537A89b71F34985433d3A3E17A0824F1e30FD17', // Avalanche
  },
  BTC: {
    1: '0x2260FAC5E5542a773Aa44fBCfeDd86b8015ff28d', // Ethereum (WBTC)
    56: '0x7130d2A12B9BCbFdd356A9Bb94a8eCEf72c7C4Bd', // BSC
    137: '0x1bfd67037b42cf73acf2047067bd4303cbd5e4da', // Polygon
  },
  BNB: {
    56: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', // BSC
  },
  POL: {
    137: '0x455e53CBB86018Ac2B8092FdCd39B507cc2469C3', // Polygon (POL)
  },
  ARB: {
    42161: '0x912CE59144191c1204e64559fe8253a0e108ff3e', // Arbitrum
  },
  OP: {
    10: '0x4200000000000000000000000000000000000042', // Optimism
  },
  AVAX: {
    43114: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // Avalanche
  },
}

// ERC-20 ABI for reading token data
export const ERC20_READ_ABI = [
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
]

// Network configurations
export const NETWORKS: Record<number, { name: string; rpc: string }> = {
  1: { name: 'Ethereum', rpc: 'https://eth.llamarpc.com' },
  56: { name: 'BSC', rpc: 'https://bsc.llamarpc.com' },
  137: { name: 'Polygon', rpc: 'https://polygon.llamarpc.com' },
  42161: { name: 'Arbitrum', rpc: 'https://arbitrum.llamarpc.com' },
  10: { name: 'Optimism', rpc: 'https://optimism.llamarpc.com' },
  8453: { name: 'Base', rpc: 'https://base.llamarpc.com' },
  43114: { name: 'Avalanche', rpc: 'https://avalanche.llamarpc.com' },
}

/**
 * Get token contract address for a specific network
 */
export function getTokenContractAddress(
  token: string,
  chainId: number
): string | undefined {
  return TOKEN_CONTRACTS[token]?.[chainId]
}

/**
 * Get all supported networks for a token
 */
export function getTokenNetworks(token: string): number[] {
  const contracts = TOKEN_CONTRACTS[token]
  return contracts ? Object.keys(contracts).map(Number) : []
}

/**
 * Get network name by chain ID
 */
export function getNetworkName(chainId: number): string {
  return NETWORKS[chainId]?.name || `Chain ${chainId}`
}

/**
 * Get network RPC URL by chain ID
 */
export function getNetworkRPC(chainId: number): string {
  return NETWORKS[chainId]?.rpc || ''
}

/**
 * Fetch token data from contract
 */
export async function fetchTokenData(
  address: string,
  chainId: number
): Promise<{ symbol: string; name: string; decimals: number } | null> {
  try {
    const rpcUrl = getNetworkRPC(chainId)
    if (!rpcUrl) return null

    // Create JSON-RPC payload for symbol
    const symbolPayload = {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: address,
          data: '0x95d89b41', // symbol() selector
        },
        'latest',
      ],
      id: 1,
    }

    // Create JSON-RPC payload for decimals
    const decimalsPayload = {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: address,
          data: '0x313ce567', // decimals() selector
        },
        'latest',
      ],
      id: 2,
    }

    // Create JSON-RPC payload for name
    const namePayload = {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: address,
          data: '0x06fdde03', // name() selector
        },
        'latest',
      ],
      id: 3,
    }

    const [symbolRes, decimalsRes, nameRes] = await Promise.all([
      fetch(rpcUrl, { method: 'POST', body: JSON.stringify(symbolPayload) }).then((r) =>
        r.json()
      ),
      fetch(rpcUrl, { method: 'POST', body: JSON.stringify(decimalsPayload) }).then((r) =>
        r.json()
      ),
      fetch(rpcUrl, { method: 'POST', body: JSON.stringify(namePayload) }).then((r) =>
        r.json()
      ),
    ])

    // Parse results
    const symbol = decodeString(symbolRes.result)
    const decimals = parseInt(decimalsRes.result || '18', 16)
    const name = decodeString(nameRes.result)

    return { symbol, name, decimals }
  } catch (error) {
    console.error(`Error fetching token data for ${address}:`, error)
    return null
  }
}

/**
 * Decode string from hex
 */
function decodeString(hex: string): string {
  if (!hex || hex === '0x') return ''
  try {
    // Remove 0x prefix and convert to bytes
    const bytes = hex.slice(2)
    // The first 32 bytes are the offset, next 32 bytes are the length
    const lengthHex = bytes.slice(64, 128)
    const length = parseInt(lengthHex, 16)
    const dataHex = bytes.slice(128, 128 + length * 2)
    return Buffer.from(dataHex, 'hex').toString('utf-8')
  } catch {
    return ''
  }
}

/**
 * Get token data for all networks
 */
export async function getTokenDataAllNetworks(
  token: string
): Promise<Record<number, TokenContractData>> {
  const networks = getTokenNetworks(token)
  const results: Record<number, TokenContractData> = {}

  for (const chainId of networks) {
    const address = getTokenContractAddress(token, chainId)
    if (!address) continue

    const data = await fetchTokenData(address, chainId)
    if (data) {
      results[chainId] = {
        address,
        symbol: data.symbol,
        name: data.name,
        decimals: data.decimals,
        chainId,
        chainName: getNetworkName(chainId),
      }
    }
  }

  return results
}

/**
 * Cache for token data to avoid repeated fetches
 */
const tokenDataCache: Record<string, Record<number, TokenContractData>> = {}

/**
 * Get cached or fetch token data
 */
export async function getTokenDataCached(
  token: string,
  chainId: number
): Promise<TokenContractData | null> {
  if (!tokenDataCache[token]) {
    tokenDataCache[token] = {}
  }

  if (tokenDataCache[token][chainId]) {
    return tokenDataCache[token][chainId]
  }

  const address = getTokenContractAddress(token, chainId)
  if (!address) return null

  const data = await fetchTokenData(address, chainId)
  if (data) {
    tokenDataCache[token][chainId] = {
      address,
      symbol: data.symbol,
      name: data.name,
      decimals: data.decimals,
      chainId,
      chainName: getNetworkName(chainId),
    }
    return tokenDataCache[token][chainId]
  }

  return null
}

/**
 * Verify token symbol from contract
 */
export async function verifyTokenSymbol(
  token: string,
  expectedSymbol: string,
  chainId: number = 1
): Promise<boolean> {
  const data = await getTokenDataCached(token, chainId)
  return data?.symbol === expectedSymbol
}
