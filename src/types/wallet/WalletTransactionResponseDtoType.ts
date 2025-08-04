export interface WalletTransactionItemType {
  afterBalance: number
  amount: number
  beforeBalance: number
  comment: string
  createdAt: string
  direction: 'INCOME' | 'EXPENSE' | null
  fromWalletId: string
  ownerWalletId: string
  toWalletId: string
  transactionId: string
  type: 'CHARGE' | 'REFUND' | 'CONVERT' | 'PAYMENT'
  updatedAt: string
}

export interface WalletTransactionResponseDtoType {
  aggregateCharge: number
  aggregateIncentive: number
  transactions: WalletTransactionItemType[]
}
