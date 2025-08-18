export interface WalletOrderItem {
  displayOrder: number
  walletId: string
}

export interface UpdatedWallet {
  balance: number
  createdAt: string
  displayOrder: number
  localCurrencyId: string
  memberId: string
  updatedAt: string
  walletId: string
  walletType: 'CASH' | 'LOCAL'
}
