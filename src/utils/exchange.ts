const EPS = 1e-9
const roundInt = (v: number) => Math.round(v + EPS)

export function calculateRechargeCashToRegion(toPercentage: number, cashAmount: number) {
  const raw = (cashAmount * (100 + toPercentage)) / 100
  const finalAmount = roundInt(raw)

  return {
    baseAmount: cashAmount,
    incentive: finalAmount - cashAmount,
    finalAmount,
  }
}

export function calculateExchangeRegionToCash(fromPercentage: number, totalAmount: number) {
  const rawCash = (totalAmount * 100) / (100 + fromPercentage)
  const finalAmount = roundInt(rawCash)

  return {
    finalAmount,
    excludedIncentive: totalAmount - finalAmount,
  }
}

export function calculateExchangeRegionToRegion(
  fromPercentage: number,
  toPercentage: number,
  totalAmount: number,
) {
  const cash = calculateExchangeRegionToCash(fromPercentage, totalAmount)
  const baseAmount = cash.finalAmount

  const recharge = calculateRechargeCashToRegion(toPercentage, baseAmount)

  return {
    baseAmount,
    incentive: recharge.incentive,
    finalAmount: recharge.finalAmount,
    excludedIncentive: cash.excludedIncentive,
  }
}
