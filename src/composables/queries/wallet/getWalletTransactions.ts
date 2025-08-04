import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/wallet/ApiResponse'
import type { WalletTransactionResponseDtoType } from '@/types/wallet/WalletTransactionResponseDtoType'
import { WALLET_KEYS } from '@/constants/QueryKey'

const ACCESS_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJpYXQiOjE3NTQwMTE1NDMsImV4cCI6MzMyOTAwMTE1NDMsInVzZXJuYW1lIjoidGVzdGVyIiwicm9sZSI6IlJPTEVfQURNSU4ifQ.6016EI8NsaegS1Zl0y1FwbzoEBTBX5TY6hKKSgK1LtI'

export const getWalletTransactions = async (
  walletId: string,
): Promise<WalletTransactionResponseDtoType> => {
  const response: AxiosResponse<ApiResponse<WalletTransactionResponseDtoType>> = await axios.get(
    `/api/wallets/${walletId}/transactions`,
    {
      headers: { Authorization: ACCESS_TOKEN },
    },
  )
  return response.data.data
}

export const useGetWalletTransactions = (walletId: string) => {
  return useQuery<WalletTransactionResponseDtoType>({
    queryKey: WALLET_KEYS.transactions(walletId),
    queryFn: () => getWalletTransactions(walletId),
  })
}
