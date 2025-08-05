import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { computed } from 'vue'

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
  const response = await axios.get(`/api/wallets/${walletId}/transactions`, {
    params,
    headers: {
      Authorization: ACCESS_TOKEN,
    },
  })
  return response.data.data
  // aggregateCharge = 내가 충전한 금액
  // aggregateIncentive = 내가 받은 혜택
  // transactions = 거래 내역
}

export const useGetWalletTransaction = (
  walletId: string,
  params: {
    startDate: string
    lastDate: string
    direction?: 'INCOME' | 'EXPENSE'
    sortOrder?: 'ASC' | 'DESC'
  },
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['wallet-transactions', walletId, params],
    queryFn: () => getWalletTransaction(walletId, params),
  })

  return {
    data: computed(() => data.value ?? null),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
  }
}
