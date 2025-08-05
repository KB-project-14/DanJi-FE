import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import type { ApiResponse } from '@/types/wallet/ApiResponse'
import { WALLET_KEYS } from '@/constants/QueryKey'

// 토큰 값 넣어주세요
// const ACCESS_TOKEN =

export const getWalletList = async (
  walletType: 'CASH' | 'LOCAL',
): Promise<WalletResponseDtoType[]> => {
  const response: AxiosResponse<ApiResponse<WalletResponseDtoType[]>> = await axios.get(
    '/api/wallets',
    {
      params: {
        // memberId 값 넣고 주석 해제
        // memberId: ,
        walletType,
      },
      headers: {
        // 위에 ACCESS_TOKEN 넣고 주석 해제
        // Authorization: ACCESS_TOKEN,
      },
    },
  )

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
