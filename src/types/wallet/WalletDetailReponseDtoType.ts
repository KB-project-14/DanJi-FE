// 카드 상세 정보
export interface WalletDetailResponseDtoType {
  balance: number
  benefitType: string
  createdAt: string
  displayOrder: number
  localCurrencyId: string
  localCurrencyName: string
  maximum: number
  memberId: string
  percentage: number
  updatedAt: string
  walletId: string
  walletType: 'CASH' | 'LOCAL'
}
