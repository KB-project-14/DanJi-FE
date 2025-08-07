// 지갑 순서 변경 요청용
export interface WalletOrderItem {
  displayOrder: number
  walletId: string
}

// 지갑 응답 데이터 타입
export interface UpdatedWallet {
  balance: number
  createdAt: string
  displayOrder: number
  localCurrencyId: string
  memberId: string
  updatedAt: string
  walletId: string
  walletType: 'CASH' | 'LOCAL'
}
