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
export {
  exchangeRegionToCash as calculateExchangeRegionToCash,
  exchangeRegionToRegion as calculateExchangeRegionToRegion,
  rechargeCashToRegion as calculateRechargeCashToRegion,
}
