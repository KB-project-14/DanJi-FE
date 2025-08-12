import { patch } from '@/api/api'
import type { WalletOrderItem, UpdatedWallet } from '@/types/wallet/WalletOrder'

export const updateWalletOrder = async (walletOrderList: WalletOrderItem[]) => {
  return await patch<UpdatedWallet[]>('api/wallets/order', walletOrderList)
}

export default updateWalletOrder
