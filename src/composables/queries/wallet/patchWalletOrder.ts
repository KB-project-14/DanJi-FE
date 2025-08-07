import { patch } from '@/api/api'

interface WalletOrderItem {
  displayOrder: number
  walletId: string
}

// 백엔드 응답 타입
interface ApiResponse<T> {
  data: T
  error?: {
    code: string
    errors: Array<{
      field: string
      reason: string
    }>
    message: string
    method: string
  }
  status: string
}

// 업데이트된 지갑 데이터 타입 (응답에서 받는 형태)
interface UpdatedWallet {
  balance: number
  createdAt: string
  displayOrder: number
  localCurrencyId: string
  memberId: string
  updatedAt: string
  walletId: string
  walletType: 'CASH' | 'LOCAL'
}

export const updateWalletOrder = async (walletOrderList: WalletOrderItem[]) => {
  const response = await patch<ApiResponse<UpdatedWallet[]>>('/api/wallets/order', walletOrderList)

  return response
}

export default updateWalletOrder
