import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { computed, unref, type MaybeRef, type ComputedRef } from 'vue'
import type { WalletTransactionParams } from '@/types/transaction/TransactionType'

const ACCESS_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJpYXQiOjE3NTQwMTE1NDMsImV4cCI6MzMyOTAwMTE1NDMsInVzZXJuYW1lIjoidGVzdGVyIiwicm9sZSI6IlJPTEVfQURNSU4ifQ.6016EI8NsaegS1Zl0y1FwbzoEBTBX5TY6hKKSgK1LtI'

export const getWalletTransaction = async (walletId: string, params: WalletTransactionParams) => {
  const response = await axios.get(`/api/wallets/${walletId}/transactions`, {
    params,
    headers: {
      Authorization: ACCESS_TOKEN,
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
