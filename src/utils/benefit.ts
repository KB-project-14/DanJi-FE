import type { BenefitType } from '@/types/local/localTypes'

export const benefitTypeTextMap: Record<BenefitType, string> = {
  CASHBACK: '캐시백',
  DISCOUNT_CHARGE: '할인 충전',
  DISCOUNT: '할인',
  BONUS_CHARGE: '인센티브',
}
