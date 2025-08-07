// 지갑 순서 변경 요청용
export interface WalletOrderItem {
  displayOrder: number
  walletId: string
}

// 백엔드 응답 공통 타입
export interface ApiError {
  code: string
  errors: Array<{
    field: string
    reason: string
  }>
  message: string
  method: string
}

export interface ApiResponse<T> {
  data: T
  error?: ApiError
  status: string
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
