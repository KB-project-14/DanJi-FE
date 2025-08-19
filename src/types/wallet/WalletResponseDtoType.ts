import type { BenefitType } from '../local/localTypes'

export type WalletType = 'CASH' | 'LOCAL'

export interface WalletResponseDtoType {
  walletId: string
  walletType: 'CASH' | 'LOCAL'
  localCurrencyId: string
  localCurrencyName: string
  benefitType: BenefitType
  percentage: number
  balance: number
  displayOrder: number
  backgroundImageUrl?: string | null
  maximum?: number
  regionId?: number
  province?: string
  city?: string
}
