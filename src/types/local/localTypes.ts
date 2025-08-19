export interface LocalResponseDTO {
  regionId: number
  province: string
  city: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type BenefitType = 'CASHBACK' | 'DISCOUNT_CHARGE' | 'DISCOUNT' | 'INCENTIVE'

export interface LocalcurrencyListRequestDTO {
  benefitType: BenefitType | null
  city: string | null
  localCurrencyId: string | null
  province: string | null
  regionId: number | null
}

export interface LocalcurrencyResponseDTO {
  createdAt: string
  updatedAt: string
  localCurrencyId: string
  regionId: number
  name: string
  benefitType: BenefitType
  maximum: number
  percentage: number
  imageUrl: string
}

export interface LocalCardCreateRequestDTO {
  localCurrencyId: string
  walletType: 'LOCAL'
}
