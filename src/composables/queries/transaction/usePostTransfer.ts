import { post } from '@/api/api'
import { TRANSACTION_TRANSFER_KEYS } from '@/constants/QueryKey'
import type { TransferRequestDTO, TransferResponseDTO } from '@/types/transaction/TransactionType'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

const postTransfer = async (transferRequest: TransferRequestDTO) => {
  const response = await post<TransferResponseDTO>('/api/wallets/transfer', transferRequest)
  return response.data.data
}

export default function usePostTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postTransfer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTION_TRANSFER_KEYS.all })
      console.log(data)
    },
  })
}
