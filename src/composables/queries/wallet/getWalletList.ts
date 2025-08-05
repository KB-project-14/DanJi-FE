import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import type { ApiResponse } from '@/types/wallet/ApiResponse'
import { WALLET_KEYS } from '@/constants/QueryKey'

const ACCESS_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJpYXQiOjE3NTQwMTE1NDMsImV4cCI6MzMyOTAwMTE1NDMsInVzZXJuYW1lIjoidGVzdGVyIiwicm9sZSI6IlJPTEVfQURNSU4ifQ.6016EI8NsaegS1Zl0y1FwbzoEBTBX5TY6hKKSgK1LtI'

export const getWalletList = async (
  walletType: 'CASH' | 'LOCAL',
): Promise<WalletResponseDtoType[]> => {
  const response: AxiosResponse<ApiResponse<WalletResponseDtoType[]>> = await axios.get(
    '/api/wallets',
    {
      params: {
        memberId: '00000000-0000-0000-0000-000000000000',
        walletType,
      },
      headers: {
        Authorization: ACCESS_TOKEN,
      },
    },
  )
  // 통합 지갑, 지역 화폐 값 잘 들어오나 확인
  console.log('API 호출 URL:', '/api/wallets', 'walletType:', walletType)
  console.log('응답 데이터:', response.data)

  return (response.data?.data ?? []).filter((w) => w.walletType === walletType)
}

const useGetWalletList = (walletType: 'CASH' | 'LOCAL') => {
  const { data } = useQuery<WalletResponseDtoType[]>({
    queryKey: WALLET_KEYS.list(walletType),
    queryFn: () => getWalletList(walletType),
    // 목 데이터 사용 중이라 최신내용 필요하여 1분 설정
    // staleTime: 1000 * 60,
  })

  return computed(() => data.value ?? [])
}
export default useGetWalletList
