interface Transaction {
  amount: number
  type: 'CHARGE' | 'REFUND' | 'CONVERT' | 'PAYMENT'
  created_at: string
}

interface Card {
  maximum: number
}

export function calculateCardStatsFromTransactions(transactions: Transaction[], card: Card) {
  // 충전 금액
  const chargedAmount = transactions
    .filter((t) => t.type === 'CHARGE')
    .reduce((sum, t) => sum + t.amount, 0)

  // 최대 한도
  const maximum = card.maximum

  // 가능 금액
  const availableAmount = maximum - chargedAmount

  return {
    chargedAmount,
    maximum,
    availableAmount,
  }
}
