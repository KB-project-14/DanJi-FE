import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { get } from '@/api/api'
import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import type { ApiResponse } from '@/types/wallet/ApiResponse'
import { WALLET_KEYS } from '@/constants/QueryKey'

export const getWalletList = async (
  walletType: 'CASH' | 'LOCAL',
): Promise<WalletResponseDtoType[]> => {
  // get 호출 시 ApiResponse 구조가 바로 반환됨
  const response = await get<ApiResponse<WalletResponseDtoType[]>>('/api/wallets', {
    params: { walletType },
  })

  // ApiResponse의 data 필드 접근
  const wallets = response.data ?? []

  // 필터링 후 반환
  return wallets.filter((w) => w.walletType === walletType)
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
