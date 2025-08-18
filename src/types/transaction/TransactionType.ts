import type { TRANSACTION_TYPE } from '@/constants/Transaction'

export type TransactionDirection = 'INCOME' | 'EXPENSE'

export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]

export interface Transaction {
  id?: string | number
  comment: string
  amount: number
  afterBalance: number
  direction: TransactionDirection
  type: TransactionType
  createdAt: string
}

export interface TransactionResponse {
  transactions: Transaction[]
  aggregateCharge: number
  aggregateIncentive: number
}

export interface WalletTransactionParams {
  startDate?: string
  lastDate?: string
  direction?: 'INCOME' | 'EXPENSE'
  sortOrder?: 'DESC' | 'ASC'
}

export interface TransferRequestDTO {
  amount: number
  fromWalletId: string
  toWalletId: string
  transactionLogging: boolean
  type: TransactionType
}

export interface TransferResponseDTO {
  transactionId: string
  ownerWalletId: string
  fromWalletId: string
  toWalletId: string
  amount: number
  beforeBalance: number
  afterBalance: number
  comment: string
  direction: TransactionDirection
  type: TransactionType
  createdAt: string
  updatedAt: string
}
