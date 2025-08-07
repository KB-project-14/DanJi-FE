import { patch } from '@/api/api'
import type { WalletOrderItem, ApiResponse, UpdatedWallet } from '@/types/wallet/WalletOrder'

export const updateWalletOrder = async (walletOrderList: WalletOrderItem[]) => {
  const response = await patch<ApiResponse<UpdatedWallet[]>>('/api/wallets/order', walletOrderList)

  return response
}

export default updateWalletOrder
