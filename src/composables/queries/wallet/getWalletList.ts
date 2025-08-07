import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { get } from '@/api/api'

import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import { WALLET_KEYS } from '@/constants/QueryKey'

export const getWalletList = async (
  walletType: 'CASH' | 'LOCAL',
): Promise<WalletResponseDtoType[]> => {
  const response = await get<WalletResponseDtoType[]>('/api/wallets', {
    params: { walletType },
  })

  // 구조 파악 후 적절히 수정
  const wallets = response.data?.data ?? [] // 또는 올바른 경로

  return wallets.filter((w: WalletResponseDtoType) => w.walletType === walletType)
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
