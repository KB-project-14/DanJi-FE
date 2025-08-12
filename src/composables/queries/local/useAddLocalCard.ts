import { WALLET_KEYS } from '@/constants/QueryKey'
import type { LocalCardCreateRequestDTO } from '@/types/local/localTypes'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { post } from '@/api/api'

const addLocalCard = async (newCardInfo: LocalCardCreateRequestDTO) => {
  const { data } = await post('api/wallets', newCardInfo)
  return data
}

export default function useAddLocalCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addLocalCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.all })
    },
  })
}
