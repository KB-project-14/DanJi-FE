export interface localResponseDtoType {
  regionId: number
  province: string
  city: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type BenefitType = 'CASHBACK' | 'DISCOUNT_CHARGE' | 'BONUS_CHARGE'

export interface localcurrencyListRequestDtoType {
  benefitType: BenefitType | null
  city: string | null
  localCurrencyId: string | null
  province: string | null
  regionId: string | null
}

export interface localcurrencyResponseDtoType {
  createdAt: string
  updatedAt: string
  localCurrencyId: string
  regionId: number
  name: string
  benefitType: BenefitType
  maximum: number
  percentage: number
}
