import { useQuery } from '@tanstack/vue-query'
import { computed, unref, type MaybeRef, type ComputedRef } from 'vue'
import { get } from '@/api/api'
import type { WalletTransactionParams } from '@/types/transaction/TransactionType'

export const getWalletTransaction = async (walletId: string, params: WalletTransactionParams) => {
  const response = await get<any>(`api/wallets/${walletId}/transactions`, {
    params,
  })

  return response.data.data
}

export const useGetWalletTransaction = (
  walletId: string,
  params: MaybeRef<WalletTransactionParams> | ComputedRef<WalletTransactionParams>,
  enabled?: MaybeRef<boolean>,
) => {
  const resolvedParams = computed(() => unref(params))

  const query = useQuery({
    queryKey: [
      'wallet-transactions',
      walletId,
      resolvedParams.value.startDate,
      resolvedParams.value.lastDate,
      resolvedParams.value.direction,
      resolvedParams.value.sortOrder,
    ],
    queryFn: () => getWalletTransaction(walletId, resolvedParams.value),
    enabled: enabled ? unref(enabled) : true,
  })

  return {
    data: computed(() => query.data.value ?? null),
    isLoading: query.isLoading,
    error: query.error,
  }
}
