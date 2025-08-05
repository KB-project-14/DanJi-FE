export interface WalletResponseDtoType {
  walletId: string
  walletType: 'CASH' | 'LOCAL'
  localCurrencyId: string
  localCurrencyName: string
  benefitType: string
  percentage: number
  balance: number
  displayOrder: number
  backgroundImageUrl?: string | null
  maximum?: number
}
