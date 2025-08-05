import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { computed, unref, type MaybeRef } from 'vue'

const ACCESS_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJpYXQiOjE3NTQwMTE1NDMsImV4cCI6MzMyOTAwMTE1NDMsInVzZXJuYW1lIjoidGVzdGVyIiwicm9sZSI6IlJPTEVfQURNSU4ifQ.6016EI8NsaegS1Zl0y1FwbzoEBTBX5TY6hKKSgK1LtI'

export const getWalletTransaction = async (
  walletId: string,
  params: {
    startDate: string
    lastDate: string
    direction?: 'INCOME' | 'EXPENSE'
    sortOrder?: 'ASC' | 'DESC'
  },
) => {
  console.log('[API 호출]', `/api/wallets/${walletId}/transactions`, params)

  const response = await axios.get(`/api/wallets/${walletId}/transactions`, {
    params,
    headers: {
      Authorization: ACCESS_TOKEN,
    },
  })

  console.log('[API 응답]', response.data)
  return response.data.data
}

export const useGetWalletTransaction = (
  walletId: string,
  params: MaybeRef<{
    startDate: string
    lastDate: string
    direction?: 'INCOME' | 'EXPENSE'
    sortOrder?: 'ASC' | 'DESC'
  }>,
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
