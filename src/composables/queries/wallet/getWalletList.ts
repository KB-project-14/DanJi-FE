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

  // walletType 필터링
  return (response.data?.data ?? []).filter((w) => w.walletType === walletType)
}

const useGetWalletList = (walletType: 'CASH' | 'LOCAL') => {
  const { data } = useQuery<WalletResponseDtoType[]>({
    queryKey: WALLET_KEYS.list(walletType),
    queryFn: () => getWalletList(walletType),
    staleTime: 1000 * 60,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  // data.value가 undefined일 때도 [] 반환
  return computed(() => (data.value ?? []) as WalletResponseDtoType[])
}

export default useGetWalletList
