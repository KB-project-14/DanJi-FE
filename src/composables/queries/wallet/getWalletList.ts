import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { get } from '@/api/api'
import type { AxiosResponse } from 'axios'

import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import type { ApiResponse } from '@/types/wallet/ApiResponse'
import { WALLET_KEYS } from '@/constants/QueryKey'

export const getWalletList = async (
  walletType: 'CASH' | 'LOCAL',
): Promise<WalletResponseDtoType[]> => {
  const response: AxiosResponse<ApiResponse<WalletResponseDtoType[]>> = await get('/api/wallets', {
    params: { walletType },
  })

  return response.data.data ?? []
}

const useGetWalletList = (walletType: 'CASH' | 'LOCAL') => {
  const { data } = useQuery<WalletResponseDtoType[]>({
    queryKey: WALLET_KEYS.list(walletType),
    queryFn: () => getWalletList(walletType),
    staleTime: 1000 * 60, // 1분 캐시
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  return computed(() => data.value ?? [])
}

export default useGetWalletList
