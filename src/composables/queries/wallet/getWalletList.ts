import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { AxiosResponse } from 'axios'
import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import type { ApiResponse } from '@/types/common/ApiResponse'
import { WALLET_KEYS } from '@/constants/QueryKey'

// Access Token 하드코딩
const ACCESS_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJpYXQiOjE3NTQwMTE1NDMsImV4cCI6MzMyOTAwMTE1NDMsInVzZXJuYW1lIjoidGVzdGVyIiwicm9sZSI6IlJPTEVfQURNSU4ifQ.6016EI8NsaegS1Zl0y1FwbzoEBTBX5TY6hKKSgK1LtI'

// API 함수
export const getWalletList = async (
  walletType: 'CASH' | 'LOCAL',
): Promise<WalletResponseDtoType[]> => {
  const response: AxiosResponse<ApiResponse<WalletResponseDtoType[]>> = await axios.get(
    '/api/wallets',
    {
      params: {
        memberId: '00000000-0000-0000-0000-000000000000', // 하드코딩
        walletType,
      },
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    },
  )
  return response.data.data
}

// useQuery 훅
const useGetWalletList = (walletType: 'CASH' | 'LOCAL') => {
  const { data } = useQuery<WalletResponseDtoType[]>({
    queryKey: WALLET_KEYS.list(walletType), // QueryKey에서 정의한 키 사용
    queryFn: () => getWalletList(walletType),
    staleTime: 1000 * 60, // 1분 캐싱
  })

  return data
}

export default useGetWalletList
