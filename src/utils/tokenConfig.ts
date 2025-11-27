// Token Configuration with Symbols and Preset Rates

export interface Token {
  symbol: string
  name: string
  decimals: number
  icon: string
  displayIcon?: string // Larger version for displays
}

export interface ExchangeRate {
  from: string
  to: string
  rate: number
  lastUpdated: number
}

// Token definitions
export const TOKENS: Record<string, Token> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    icon: '⟠',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    decimals: 6,
    icon: '💵',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    icon: '🪙',
  },
  USDTz: {
    symbol: 'USDTz',
    name: 'USDTz Hybrid',
    decimals: 6,
    icon: '/USDTz-token-inline.png',
    displayIcon: '/USDTz-token.png',
  },
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    icon: '🟠',
  },
  BNB: {
    symbol: 'BNB',
    name: 'Binance Coin',
    decimals: 18,
    icon: '🟡',
  },
  POL: {
    symbol: 'POL',
    name: 'Polygon',
    decimals: 18,
    icon: '🟣',
  },
  ARB: {
    symbol: 'ARB',
    name: 'Arbitrum',
    decimals: 18,
    icon: '🔵',
  },
  OP: {
    symbol: 'OP',
    name: 'Optimism',
    decimals: 18,
    icon: '🔴',
  },
  AVAX: {
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    icon: '🔺',
  },
}

// Preset exchange rates for USDTz and common pairs
export const PRESET_RATES: Record<string, number> = {
  'ETH-USDT': 2450.50,
  'ETH-USDC': 2450.50,
  'ETH-USDTz': 2450.50, // 1:1 USD peg
  'BTC-USDT': 42500.00,
  'BTC-USDC': 42500.00,
  'BTC-USDTz': 42500.00,
  'BNB-USDT': 612.75,
  'BNB-USDC': 612.75,
  'BNB-USDTz': 612.75,
  'POL-USDT': 0.85,
  'POL-USDC': 0.85,
  'POL-USDTz': 0.85,
  'USDT-USDC': 1.0,
  'USDT-USDTz': 1.0, // 1:1 peg
  'USDC-USDTz': 1.0, // 1:1 peg
  'USDC-USDT': 1.0,
  'USDTz-USDT': 1.0,
  'USDTz-USDC': 1.0,
  'USDTz-ETH': 1 / 2450.50,
  'USDTz-BTC': 1 / 42500.00,
  'USDTz-BNB': 1 / 612.75,
  'USDTz-POL': 1 / 0.85,
}

// Bridge fees by token
export const BRIDGE_FEES: Record<string, number> = {
  ETH: 0.005, // 0.5%
  USDT: 0.005,
  USDC: 0.005,
  USDTz: 0.005,
  BTC: 0.005,
  BNB: 0.005,
  POL: 0.005,
  ARB: 0.005,
  OP: 0.005,
  AVAX: 0.005,
}

// Swap fees by token pair
export const SWAP_FEES: Record<string, number> = {
  'ETH-USDT': 0.005,
  'ETH-USDC': 0.005,
  'ETH-USDTz': 0.005,
  'BTC-USDT': 0.005,
  'BTC-USDC': 0.005,
  'BTC-USDTz': 0.005,
  'USDT-USDC': 0.003,
  'USDT-USDTz': 0.003,
  'USDC-USDTz': 0.003,
}

/**
 * Get exchange rate between two tokens
 */
export function getExchangeRate(fromToken: string, toToken: string): number {
  const key = `${fromToken}-${toToken}`
  const reverseKey = `${toToken}-${fromToken}`

  if (PRESET_RATES[key]) {
    return PRESET_RATES[key]
  }

  if (PRESET_RATES[reverseKey]) {
    return 1 / PRESET_RATES[reverseKey]
  }

  // Default to 1 if no rate found
  return 1
}

/**
 * Calculate swap amount with fee
 */
export function calculateSwapAmount(
  fromAmount: string,
  fromToken: string,
  toToken: string
): { amount: string; fee: string; feePercentage: number } {
  const amount = parseFloat(fromAmount)
  if (isNaN(amount) || amount <= 0) {
    return { amount: '0', fee: '0', feePercentage: 0 }
  }

  const rate = getExchangeRate(fromToken, toToken)
  const feeKey = `${fromToken}-${toToken}`
  const feePercentage = SWAP_FEES[feeKey] || 0.005 // Default 0.5%

  const grossAmount = amount * rate
  const fee = grossAmount * feePercentage
  const netAmount = grossAmount - fee

  return {
    amount: netAmount.toFixed(6),
    fee: fee.toFixed(6),
    feePercentage: feePercentage * 100,
  }
}

/**
 * Calculate bridge amount with fee
 */
export function calculateBridgeAmount(
  amount: string,
  token: string
): { amount: string; fee: string; feePercentage: number } {
  const tokenAmount = parseFloat(amount)
  if (isNaN(tokenAmount) || tokenAmount <= 0) {
    return { amount: '0', fee: '0', feePercentage: 0 }
  }

  const feePercentage = BRIDGE_FEES[token] || 0.005 // Default 0.5%
  const fee = tokenAmount * feePercentage
  const netAmount = tokenAmount - fee

  return {
    amount: netAmount.toFixed(6),
    fee: fee.toFixed(6),
    feePercentage: feePercentage * 100,
  }
}

/**
 * Get all available tokens
 */
export function getAllTokens(): Token[] {
  return Object.values(TOKENS)
}

/**
 * Get token by symbol
 */
export function getToken(symbol: string): Token | undefined {
  return TOKENS[symbol]
}

/**
 * Format token display with symbol (inline)
 */
export function formatTokenDisplay(symbol: string): string {
  const token = TOKENS[symbol]
  if (!token) return symbol
  return `${token.icon} ${token.symbol}`
}

/**
 * Check if token icon is an image
 */
export function isImageIcon(icon: string): boolean {
  return icon.startsWith('/')
}

/**
 * Get inline icon (20x20)
 */
export function getInlineIcon(symbol: string): string {
  const token = TOKENS[symbol]
  return token?.icon || ''
}

/**
 * Get display icon (64x64 or larger)
 */
export function getDisplayIcon(symbol: string): string {
  const token = TOKENS[symbol]
  return token?.displayIcon || token?.icon || ''
}

/**
 * Format token option for dropdown
 */
export function formatTokenOption(symbol: string): { display: string; symbol: string; name: string } {
  const token = TOKENS[symbol]
  if (!token) {
    return { display: symbol, symbol, name: '' }
  }
  return {
    display: `${token.icon} ${token.symbol}`,
    symbol: token.symbol,
    name: token.name,
  }
}

/**
 * Get supported tokens for swap
 */
export function getSupportedSwapTokens(): string[] {
  return ['ETH', 'USDT', 'USDC', 'USDTz', 'BTC', 'BNB']
}

/**
 * Get supported tokens for bridge
 */
export function getSupportedBridgeTokens(): string[] {
  return ['ETH', 'USDT', 'USDC', 'USDTz', 'BTC', 'BNB', 'POL', 'ARB', 'OP', 'AVAX']
}

/**
 * Validate if swap is possible between two tokens
 */
export function isSwapPossible(fromToken: string, toToken: string): boolean {
  if (fromToken === toToken) return false
  const key = `${fromToken}-${toToken}`
  const reverseKey = `${toToken}-${fromToken}`
  return PRESET_RATES[key] !== undefined || PRESET_RATES[reverseKey] !== undefined
}

/**
 * Validate if bridge is possible for a token
 */
export function isBridgePossible(token: string): boolean {
  return BRIDGE_FEES[token] !== undefined
}
