export interface WalletResponseDtoType {
  balance: number
  createdAt: string
  displayOrder: number
  localCurrencyId: string
  memberId: string
  updatedAt: string
  walletId: string
  walletType: 'CASH' | 'LOCAL' // 통합지갑 | 지역화폐카드
}
