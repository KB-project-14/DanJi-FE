import { LOCAL_KEYS } from '@/constants/QueryKey'
import type { localCardCreateRequestDtoType } from '@/types/local/localTypes'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { post } from '@/api/api'

const addLocalCard = async (newCardInfo: localCardCreateRequestDtoType) => {
  const { data } = await post('/api/wallets', newCardInfo)
  return data
}

export default function useAddLocalCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addLocalCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCAL_KEYS.details })
    },
  })
}
