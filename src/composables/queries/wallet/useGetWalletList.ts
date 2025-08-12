import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { get } from '@/api/api'

import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import { WALLET_KEYS } from '@/constants/QueryKey'

export const getWalletList = async (
  walletType: 'CASH' | 'LOCAL',
): Promise<WalletResponseDtoType[]> => {
  const response = await get<WalletResponseDtoType[]>('api/wallets', {
    params: { walletType },
  })

  const wallets = response.data?.data ?? []

  return wallets.filter((w: WalletResponseDtoType) => w.walletType === walletType)
}
const useGetWalletList = (walletType: 'CASH' | 'LOCAL') => {
  const { data } = useQuery<WalletResponseDtoType[]>({
    queryKey: WALLET_KEYS.list(walletType),
    queryFn: () => getWalletList(walletType),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  return computed(() => data.value ?? [])
}

export default useGetWalletList
