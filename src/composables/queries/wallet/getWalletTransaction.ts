import { useQuery } from '@tanstack/vue-query'
import { computed, unref, type MaybeRef, type ComputedRef } from 'vue'
import { get } from '@/api/api'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/wallet/ApiResponse'
import type { WalletTransactionParams, Transaction } from '@/types/transaction/TransactionType'

/**
 * 특정 지갑의 거래내역 조회
 */
export const getWalletTransaction = async (
  walletId: string,
  params: WalletTransactionParams,
): Promise<Transaction[]> => {
  // get 함수는 ApiResponse<T> 반환하므로 data.data 접근
  const response: AxiosResponse<ApiResponse<Transaction[]>> = await get(
    `/api/wallets/${walletId}/transactions`,
    {
      params,
    },
  )

  return response.data.data ?? { transactions: [], aggregateCharge: 0, aggregateIncentive: 0 }
}

/**
 * Vue Query 훅
 */
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
    // 항상 배열로 반환되게 처리
    data: computed(() => query.data.value ?? []),
    isLoading: query.isLoading,
    error: query.error,
  }
}
