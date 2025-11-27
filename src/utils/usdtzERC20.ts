// USDTz ERC-20 Contract Configuration and Utilities
import { Contract } from 'ethers'

// USDTz Contract Addresses on different networks
export const USDTZ_CONTRACTS = {
  ethereum: '0xB537A89b71F34985433d3A3E17A0824F1e30FD17',
  bsc: '0x1234567890123456789012345678901234567890',
  polygon: '0x1234567890123456789012345678901234567890',
  arbitrum: '0x1234567890123456789012345678901234567890',
  optimism: '0x1234567890123456789012345678901234567890',
  base: '0x1234567890123456789012345678901234567890',
  avalanche: '0x1234567890123456789012345678901234567890',
}

// ERC-20 Standard ABI
export const ERC20_ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function totalSupply() external view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]

// USDTz Specific ABI with mint/burn functions
export const USDTZ_ABI = [
  ...ERC20_ABI,
  'function mint(address to, uint256 amount) external',
  'function burn(uint256 amount) external',
  'function burnFrom(address account, uint256 amount) external',
  'function minter() external view returns (address)',
  'function backingRatio() external view returns (uint256)',
  'function totalBacking() external view returns (uint256)',
]

export interface USDTzBalance {
  balance: string
  decimals: number
  symbol: string
  formatted: string
}

export interface USDTzTransaction {
  hash: string
  from: string
  to: string
  amount: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
  type: 'deposit' | 'withdrawal' | 'transfer'
}

// Network RPC URLs
export const RPC_URLS = {
  ethereum: 'https://eth.llamarpc.com',
  bsc: 'https://bsc.llamarpc.com',
  polygon: 'https://polygon.llamarpc.com',
  arbitrum: 'https://arbitrum.llamarpc.com',
  optimism: 'https://optimism.llamarpc.com',
  base: 'https://base.llamarpc.com',
  avalanche: 'https://avalanche.llamarpc.com',
}

export interface DepositRequest {
  amount: string
  network: keyof typeof USDTZ_CONTRACTS
  walletAddress: string
}

export interface WithdrawalRequest {
  amount: string
  network: keyof typeof USDTZ_CONTRACTS
  walletAddress: string
  recipientAddress: string
}

export interface USDTzDepositAddress {
  network: string
  address: string
  qrCode: string
  minDeposit: string
  maxDeposit: string
  confirmations: number
}

// Validate Ethereum address
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Format amount with decimals
export function formatAmount(amount: string, decimals: number = 6): string {
  const num = parseFloat(amount)
  return num.toFixed(decimals)
}

// Parse amount to contract format
export function parseAmount(amount: string, decimals: number = 6): string {
  const num = parseFloat(amount)
  return (num * Math.pow(10, decimals)).toFixed(0)
}

// Get network name from chain ID
export function getNetworkName(chainId: number): keyof typeof USDTZ_CONTRACTS | null {
  const networks: { [key: number]: keyof typeof USDTZ_CONTRACTS } = {
    1: 'ethereum',
    56: 'bsc',
    137: 'polygon',
    42161: 'arbitrum',
    10: 'optimism',
    8453: 'base',
    43114: 'avalanche',
  }
  return networks[chainId] || null
}

// Get chain ID from network name
export function getChainId(network: keyof typeof USDTZ_CONTRACTS): number {
  const chainIds: { [key in keyof typeof USDTZ_CONTRACTS]: number } = {
    ethereum: 1,
    bsc: 56,
    polygon: 137,
    arbitrum: 42161,
    optimism: 10,
    base: 8453,
    avalanche: 43114,
  }
  return chainIds[network]
}

// Get explorer URL
export function getExplorerUrl(network: keyof typeof USDTZ_CONTRACTS, address: string): string {
  const explorers: { [key in keyof typeof USDTZ_CONTRACTS]: string } = {
    ethereum: 'https://etherscan.io/address/',
    bsc: 'https://bscscan.com/address/',
    polygon: 'https://polygonscan.com/address/',
    arbitrum: 'https://arbiscan.io/address/',
    optimism: 'https://optimistic.etherscan.io/address/',
    base: 'https://basescan.org/address/',
    avalanche: 'https://snowtrace.io/address/',
  }
  return explorers[network] + address
}

// Transaction fee estimation
export function estimateFee(amount: string, _network?: keyof typeof USDTZ_CONTRACTS): string {
  const baseFee = 0.005 // 0.5%
  const num = parseFloat(amount)
  const fee = num * baseFee
  return fee.toFixed(6)
}

// Validate deposit amount
export function validateDepositAmount(amount: string, _network?: keyof typeof USDTZ_CONTRACTS): {
  valid: boolean
  error?: string
} {
  const num = parseFloat(amount)

  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' }
  }

  const minDeposit = 10 // $10 minimum
  if (num < minDeposit) {
    return { valid: false, error: `Minimum deposit is $${minDeposit}` }
  }

  const maxDeposit = 1000000 // $1M maximum
  if (num > maxDeposit) {
    return { valid: false, error: `Maximum deposit is $${maxDeposit}` }
  }

  return { valid: true }
}

// Validate withdrawal amount
export function validateWithdrawalAmount(amount: string, balance: string): {
  valid: boolean
  error?: string
} {
  const num = parseFloat(amount)
  const bal = parseFloat(balance)

  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' }
  }

  if (num > bal) {
    return { valid: false, error: 'Insufficient balance' }
  }

  const minWithdrawal = 1 // $1 minimum
  if (num < minWithdrawal) {
    return { valid: false, error: `Minimum withdrawal is $${minWithdrawal}` }
  }

  return { valid: true }
}
