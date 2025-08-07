import { useQuery } from '@tanstack/vue-query'
import { computed, unref, type MaybeRef, type ComputedRef } from 'vue'
import { get } from '@/api/api'
import type { WalletTransactionParams } from '@/types/transaction/TransactionType'

// 단일 API 호출 함수
export const getWalletTransaction = async (walletId: string, params: WalletTransactionParams) => {
  // get() → AxiosResponse<ApiResponse<T>> 반환
  const response = await get<any>(`/api/wallets/${walletId}/transactions`, {
    params,
  })

  // 실제 데이터 접근
  return response.data.data
}

// Vue Query 훅
export const useGetWalletTransaction = (
  walletId: string,
  params: MaybeRef<WalletTransactionParams> | ComputedRef<WalletTransactionParams>,
  enabled?: MaybeRef<boolean>,
) => {
  // params 반응형 처리
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
