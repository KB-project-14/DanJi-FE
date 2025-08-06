import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { get } from '@/api/api'
import type { ApiResponse } from '@/types/types'

import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import { WALLET_KEYS } from '@/constants/QueryKey'

export const getWalletList = async (
  walletType: 'CASH' | 'LOCAL',
): Promise<WalletResponseDtoType[]> => {
  const response = await get<ApiResponse<WalletResponseDtoType[]>>('/api/wallets', {
    params: { walletType },
  })

  return (response.data.data ?? []).filter(
    (w) => w.walletType === walletType,
  ) as WalletResponseDtoType[]
}

const useGetWalletList = (walletType: 'CASH' | 'LOCAL') => {
  const { data } = useQuery<WalletResponseDtoType[]>({
    queryKey: WALLET_KEYS.list(walletType),
    queryFn: () => getWalletList(walletType),
    staleTime: 1000 * 60,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  return computed(() => data.value ?? [])
}

export default useGetWalletList
