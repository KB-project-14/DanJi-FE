import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import type { ApiResponse } from '@/types/wallet/ApiResponse'
import { WALLET_KEYS } from '@/constants/QueryKey'

const ACCESS_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJpYXQiOjE3NTQwMTE1NDMsImV4cCI6MzMyOTAwMTE1NDMsInVzZXJuYW1lIjoidGVzdGVyIiwicm9sZSI6IlJPTEVfQURNSU4ifQ.6016EI8NsaegS1Zl0y1FwbzoEBTBX5TY6hKKSgK1LtI'

export const getWalletDetail = async (walletId: string): Promise<WalletResponseDtoType> => {
  const response: AxiosResponse<ApiResponse<WalletResponseDtoType>> = await axios.get(
    `/api/wallets/${walletId}`,
    {
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    },
  )
  return response.data.data
}

const useGetWalletDetail = (walletId: string) => {
  const { data } = useQuery<WalletResponseDtoType>({
    queryKey: WALLET_KEYS.detail(walletId),
    queryFn: () => getWalletDetail(walletId),
    enabled: !!walletId,
    staleTime: 1000 * 60,
  })

  return data
}

export default useGetWalletDetail
