import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { del } from '@/api/api'
import { WALLET_KEYS } from '@/constants/QueryKey'

export const deleteWallet = async (walletId: string) => {
  return await del(`/api/wallets/${walletId}`)
}

const useDeleteWallet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWallet,
    onSuccess: () => {
      // 지갑 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.all })
    },
  })
}

export default useDeleteWallet
