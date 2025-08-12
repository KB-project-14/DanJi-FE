const EPS = 1e-9
const roundInt = (v: number) => Math.round(v + EPS)

export function rechargeCashToRegion(toPercentage: number, cashAmount: number) {
  const raw = (cashAmount * (100 + toPercentage)) / 100
  const finalAmount = roundInt(raw)
  return {
    baseAmount: cashAmount,
    incentive: finalAmount - cashAmount,
    finalAmount,
  }
}

export function exchangeRegionToCash(fromPercentage: number, totalAmount: number) {
  const rawCash = (totalAmount * 100) / (100 + fromPercentage)
  const finalAmount = roundInt(rawCash)
  return {
    finalAmount,
    excludedIncentive: totalAmount - finalAmount,
  }
}

export function exchangeRegionToRegion(
  fromPercentage: number,
  toPercentage: number,
  totalAmount: number,
) {
  const cash = exchangeRegionToCash(fromPercentage, totalAmount)
  const baseAmount = cash.finalAmount
  const recharge = rechargeCashToRegion(toPercentage, baseAmount)
  return {
    baseAmount,
    incentive: recharge.incentive,
    finalAmount: recharge.finalAmount,
    excludedIncentive: cash.excludedIncentive,
  }
}

/** @deprecated 숫자만 필요할 때 임시로 사용. 가능하면 exchangeRegionToCash(...).finalAmount로 마이그레이션하세요. */
export function calculateExchangeRegionToCash(fromPercentage: number, totalAmount: number): number {
  return exchangeRegionToCash(fromPercentage, totalAmount).finalAmount
}

/** @deprecated 숫자만 필요할 때 임시로 사용. 가능하면 exchangeRegionToRegion(...).finalAmount로 마이그레이션하세요. */
export function calculateExchangeRegionToRegion(
  fromPercentage: number,
  toPercentage: number,
  totalAmount: number,
): number {
  return exchangeRegionToRegion(fromPercentage, toPercentage, totalAmount).finalAmount
}

/** @deprecated 숫자만 필요할 때 임시로 사용. 가능하면 rechargeCashToRegion(...).finalAmount로 마이그레이션하세요. */
export function calculateRechargeCashToRegion(toPercentage: number, cashAmount: number): number {
  return rechargeCashToRegion(toPercentage, cashAmount).finalAmount
}
