import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { computed, unref, type MaybeRef, type ComputedRef } from 'vue'
import type { WalletTransactionParams } from '@/types/transaction/TransactionType'

// 토큰 값 넣어주세요
// const ACCESS_TOKEN =

export const getWalletTransaction = async (walletId: string, params: WalletTransactionParams) => {
  const response = await axios.get(`/api/wallets/${walletId}/transactions`, {
    params,
    headers: {
      // 위에 ACCESS_TOKEN 넣고 주석 해제
      // Authorization: ACCESS_TOKEN,
    },
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
