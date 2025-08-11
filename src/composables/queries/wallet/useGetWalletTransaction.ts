import { useQuery } from '@tanstack/vue-query'
import { computed, unref, type MaybeRef, type ComputedRef } from 'vue'
import { get } from '@/api/api'
import type { WalletTransactionParams } from '@/types/transaction/TransactionType'

export const getWalletTransaction = async (walletId: string, params: WalletTransactionParams) => {
  const { data } = await get<any>(`/api/wallets/${walletId}/transactions`, { params })
  return data.data
}

export const useGetWalletTransaction = (
  walletId: string,
  params: MaybeRef<WalletTransactionParams> | ComputedRef<WalletTransactionParams>,
  enabled?: MaybeRef<boolean>,
) => {
  const resolvedParams = computed<WalletTransactionParams>(() => unref(params) ?? {})

  const queryKey = computed(() => [
    'wallet-transactions',
    walletId ?? null,
    resolvedParams.value.startDate ?? null,
    resolvedParams.value.lastDate ?? null,
    resolvedParams.value.direction ?? null,
    resolvedParams.value.sortOrder ?? null,
  ])

  const isEnabled = computed(() => {
    const base = enabled !== undefined ? !!unref(enabled) : true
    return base && !!walletId
  })

  const query = useQuery({
    queryKey,
    queryFn: () => getWalletTransaction(walletId, resolvedParams.value),
    enabled: isEnabled,
    staleTime: 60 * 1000,
    retry: 1,
  })

  return {
    data: computed(() => query.data.value ?? null),
    isLoading: query.isLoading,
    error: query.error,
  }
}
