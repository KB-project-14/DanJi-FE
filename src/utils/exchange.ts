export function calculateExchangeRegionToRegion(
  fromPercentage: number,
  toPercentage: number,
  totalAmount: number,
) {
  // 1. From 카드 현금화 (인센티브 제거)
  const cashValue = totalAmount / (1 + fromPercentage / 100) // 현금 가치
  const excludedIncentive = totalAmount - cashValue // 제외된 인센티브 금액

  // 2. To 카드 충전 금액
  const baseAmount = Math.floor(cashValue) // 소수점 버림
  const incentive = Math.round(baseAmount * (toPercentage / 100)) // To 카드 인센티브
  const finalAmount = Math.round(baseAmount + incentive) // 최종 환전 금액

  return { baseAmount, incentive, finalAmount, excludedIncentive }
}

// 지역 → 현금
export function calculateExchangeRegionToCash(fromPercentage: number, totalAmount: number) {
  // 인센티브 제외
  const excludedIncentive = Math.floor(totalAmount * (fromPercentage / 100))
  const finalAmount = totalAmount - excludedIncentive

  return { finalAmount, excludedIncentive }
}
