export function calculateExchange(
  fromPercentage: number,
  toPercentage: number,
  totalAmount: number,
) {
  // 1. From 카드 → 현금 (인센티브 제외)
  const fromRate = 1 + fromPercentage / 100
  const cashValue = totalAmount / fromRate

  // 제외된 인센티브 (From 카드 인센티브 부분)
  const excludedIncentive = totalAmount - cashValue

  // 2. 현금 → To 카드 변환
  const baseAmount = Math.round(cashValue) // 소수점 버림
  const incentive = Math.round(baseAmount * (toPercentage / 100)) //소수점 올림

  // 3. 최종 충전 금액 (반올림)
  const finalAmount = Math.round(baseAmount + incentive)

  return {
    baseAmount, // 충전 금액
    incentive, // To 카드 인센티브
    finalAmount, // 최종 충전 금액
    excludedIncentive, // From 카드에서 제외된 인센티브
  }
}
