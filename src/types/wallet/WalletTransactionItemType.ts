// 거래내역 단일 아이템
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
