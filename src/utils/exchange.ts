function customRound(value: number) {
  const decimal = value - Math.floor(value)
  // 소수점이 정확히 .5일 때 무조건 내림
  if (decimal === 0.5) return Math.floor(value)
  return Math.round(value)
}
// 지역 → 지역 환전
export function calculateExchangeRegionToRegion(
  fromPercentage: number,
  toPercentage: number,
  totalAmount: number,
) {
  // 1. From → 현금화 (인센티브 제거)
  const cashValue = totalAmount / (1 + fromPercentage / 100)
  const excludedIncentive = totalAmount - cashValue

  // 2. 현금화 금액 (커스텀 라운드 적용)
  const baseAmount = customRound(cashValue)

  // 3. To 카드 인센티브 (커스텀 라운드 적용)
  const incentive = customRound(baseAmount * (toPercentage / 100))

  // 4. 최종 환전 금액 (커스텀 라운드 적용)
  const finalAmount = customRound(baseAmount + incentive)

  return {
    baseAmount, // 충전 금액
    incentive, // 인센티브
    finalAmount, // 최종 환전 금액
    excludedIncentive, // 제외된 인센티브
  }
}

export function calculateExchangeRegionToCash(fromPercentage: number, totalAmount: number) {
  // From 카드 인센티브 제외
  const excludedIncentive = Math.floor(totalAmount * (fromPercentage / 100))
  const finalAmount = totalAmount - excludedIncentive

  return {
    finalAmount,
    excludedIncentive,
  }
}
