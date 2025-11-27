// ERC-20 USDTz Deposit Handler
// Handles deposits from 0xB537A89b71F34985433d3A3E17A0824F1e30FD17 to user wallets
// 1:1 USD pegging at source

import { ethers } from 'ethers'
import { USDTZ_CONTRACTS, ERC20_ABI, RPC_URLS, getChainId } from './usdtzERC20'

export interface DepositTransaction {
  hash: string
  from: string
  to: string
  amount: string
  amountUSD: string
  network: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
  blockNumber?: number
  confirmations?: number
}

export interface DepositConfig {
  sourceAddress: string // 0xB537A89b71F34985433d3A3E17A0824F1e30FD17
  network: string
  decimals: number
  usdPeg: number // 1:1 peg to USD
}

// Default deposit configuration
export const DEFAULT_DEPOSIT_CONFIG: DepositConfig = {
  sourceAddress: '0xB537A89b71F34985433d3A3E17A0824F1e30FD17',
  network: 'ethereum',
  decimals: 6, // USDTz uses 6 decimals like USDT
  usdPeg: 1, // 1 USDTz = 1 USD
}

/**
 * Create a provider for the specified network
 */
export function getProvider(network: string) {
  const rpcUrl = (RPC_URLS as any)[network]
  return new ethers.JsonRpcProvider(rpcUrl)
}

/**
 * Get USDTz contract instance
 */
export function getUSDTzContract(
  network: string,
  signerOrProvider?: ethers.Signer | ethers.Provider
) {
  const address = (USDTZ_CONTRACTS as any)[network]
  const provider = signerOrProvider || getProvider(network)
  return new ethers.Contract(address, ERC20_ABI, provider)
}

/**
 * Check USDTz balance at source address
 */
export async function getSourceBalance(network: string): Promise<string> {
  try {
    const contract = getUSDTzContract(network)
    const balance = await contract.balanceOf(DEFAULT_DEPOSIT_CONFIG.sourceAddress)
    // Convert from wei to decimal format (6 decimals for USDTz)
    return ethers.formatUnits(balance, DEFAULT_DEPOSIT_CONFIG.decimals)
  } catch (error) {
    console.error('Error fetching source balance:', error)
    throw error
  }
}

/**
 * Get user's USDTz balance
 */
export async function getUserBalance(
  userAddress: string,
  network: string
): Promise<string> {
  try {
    if (!ethers.isAddress(userAddress)) {
      throw new Error('Invalid user address')
    }

    const contract = getUSDTzContract(network)
    const balance = await contract.balanceOf(userAddress)
    return ethers.formatUnits(balance, DEFAULT_DEPOSIT_CONFIG.decimals)
  } catch (error) {
    console.error('Error fetching user balance:', error)
    throw error
  }
}

/**
 * Prepare deposit transaction data
 * Returns the transaction data that would be sent to deposit USDTz
 */
export async function prepareDepositTransaction(
  amount: string,
  recipientAddress: string,
  network: string
) {
  try {
    if (!ethers.isAddress(recipientAddress)) {
      throw new Error('Invalid recipient address')
    }

    const contract = getUSDTzContract(network)
    
    // Convert amount to contract format (with decimals)
    const amountInWei = ethers.parseUnits(amount, DEFAULT_DEPOSIT_CONFIG.decimals)
    
    // Calculate USD value (1:1 peg)
    const amountUSD = (parseFloat(amount) * DEFAULT_DEPOSIT_CONFIG.usdPeg).toFixed(2)

    // Create transfer data
    const transferData = contract.interface.encodeFunctionData('transfer', [
      recipientAddress,
      amountInWei,
    ])

    return {
      to: (USDTZ_CONTRACTS as any)[network],
      data: transferData,
      amount: amount,
      amountUSD: amountUSD,
      value: '0', // No ETH value needed for ERC-20 transfer
      network,
      chainId: getChainId(network as any),
    }
  } catch (error) {
    console.error('Error preparing deposit transaction:', error)
    throw error
  }
}

/**
 * Simulate a deposit transaction (for UI preview)
 */
export async function simulateDeposit(
  amount: string,
  recipientAddress: string,
  network: string
): Promise<DepositTransaction> {
  try {
    const sourceBalance = await getSourceBalance(network)
    
    if (parseFloat(amount) > parseFloat(sourceBalance)) {
      throw new Error('Insufficient balance at source address')
    }

    const amountUSD = (parseFloat(amount) * DEFAULT_DEPOSIT_CONFIG.usdPeg).toFixed(2)

    return {
      hash: `0x${Math.random().toString(16).slice(2)}`, // Mock hash for simulation
      from: DEFAULT_DEPOSIT_CONFIG.sourceAddress,
      to: recipientAddress,
      amount: amount,
      amountUSD: amountUSD,
      network: network,
      status: 'pending',
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error('Error simulating deposit:', error)
    throw error
  }
}

/**
 * Get transaction receipt and status
 */
export async function getTransactionStatus(
  txHash: string,
  network: string
): Promise<DepositTransaction | null> {
  try {
    const provider = getProvider(network)
    const receipt = await provider.getTransactionReceipt(txHash)

    if (!receipt) {
      return null
    }

    const tx = await provider.getTransaction(txHash)
    if (!tx) {
      return null
    }

    const status = receipt.status === 1 ? 'confirmed' : 'failed'
    const currentBlock = await provider.getBlockNumber()

    return {
      hash: txHash,
      from: tx.from,
      to: tx.to || '',
      amount: ethers.formatUnits(tx.value, DEFAULT_DEPOSIT_CONFIG.decimals),
      amountUSD: (parseFloat(ethers.formatUnits(tx.value, DEFAULT_DEPOSIT_CONFIG.decimals)) * DEFAULT_DEPOSIT_CONFIG.usdPeg).toFixed(2),
      network: network,
      status: status,
      timestamp: (await provider.getBlock(receipt.blockNumber))?.timestamp || Date.now(),
      blockNumber: receipt.blockNumber,
      confirmations: currentBlock - receipt.blockNumber,
    }
  } catch (error) {
    console.error('Error getting transaction status:', error)
    throw error
  }
}

/**
 * Format deposit amount for display
 */
export function formatDepositAmount(amount: string, decimals: number = 6): string {
  try {
    const num = parseFloat(amount)
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals,
    })
  } catch {
    return '0'
  }
}

/**
 * Calculate deposit fee (0.5%)
 */
export function calculateDepositFee(amount: string, feePercentage: number = 0.005): string {
  const num = parseFloat(amount)
  const fee = num * feePercentage
  return fee.toFixed(6)
}

/**
 * Calculate net deposit amount after fee
 */
export function calculateNetDeposit(amount: string, feePercentage: number = 0.005): string {
  const num = parseFloat(amount)
  const fee = num * feePercentage
  const net = num - fee
  return net.toFixed(6)
}

/**
 * Validate deposit parameters
 */
export function validateDepositParams(
  amount: string,
  recipientAddress: string,
  network: string
): { valid: boolean; error?: string } {
  // Validate amount
  const amountNum = parseFloat(amount)
  if (isNaN(amountNum) || amountNum <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' }
  }

  if (amountNum < 10) {
    return { valid: false, error: 'Minimum deposit is $10' }
  }

  if (amountNum > 1000000) {
    return { valid: false, error: 'Maximum deposit is $1,000,000' }
  }

  // Validate recipient address
  if (!ethers.isAddress(recipientAddress)) {
    return { valid: false, error: 'Invalid recipient address' }
  }

  // Validate network
  const validNetworks = Object.keys(USDTZ_CONTRACTS)
  if (!validNetworks.includes(network)) {
    return { valid: false, error: 'Invalid network' }
  }

  return { valid: true }
}

/**
 * Get deposit fee structure
 */
export function getDepositFeeStructure(amount: string) {
  const amountNum = parseFloat(amount)
  const fee = calculateDepositFee(amount)
  const net = calculateNetDeposit(amount)
  const feePercentage = 0.5

  return {
    amount: amountNum.toFixed(2),
    fee: parseFloat(fee).toFixed(2),
    feePercentage: feePercentage,
    net: parseFloat(net).toFixed(2),
    amountUSD: (amountNum * DEFAULT_DEPOSIT_CONFIG.usdPeg).toFixed(2),
    netUSD: (parseFloat(net) * DEFAULT_DEPOSIT_CONFIG.usdPeg).toFixed(2),
  }
}
