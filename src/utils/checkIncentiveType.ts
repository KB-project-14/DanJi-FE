import { benefitTypeTextMap } from '@/constants/BenefitMapper'
import type { BenefitType } from '@/types/local/localTypes'

export const isIncentiveWallet = (benefitType: BenefitType) => {
  return benefitTypeTextMap[benefitType] === '인센티브'
}
