export interface localResponseDtoType {
  regionId: number
  province: string
  city: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type BenefitType = 'CASHBACK' | 'DISCOUNT_CHARGE' | 'DISCOUNT' | 'BONUS_CHARGE' | 'INCENTIVE'

export interface localcurrencyListRequestDtoType {
  benefitType: BenefitType | null
  city: string | null
  localCurrencyId: string | null
  province: string | null
  regionId: number | null
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

//TODO:: walletType을 나중에 지갑 쪽 타입이랑 합치기
export interface localCardCreateRequestDtoType {
  localCurrencyId: string
  walletType: 'LOCAL'
}
