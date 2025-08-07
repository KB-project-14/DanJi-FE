import { useQuery } from '@tanstack/vue-query'
import { get } from '@/api/api'
import { WALLET_KEYS } from '@/constants/QueryKey'
import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import { computed } from 'vue'

export const getWallet = async (walletId: string): Promise<WalletResponseDtoType> => {
  const response = await get<WalletResponseDtoType>(`/api/wallets/${walletId}`)
  return response.data.data
}

const useGetWallet = (walletId: string) => {
  const { data } = useQuery<WalletResponseDtoType>({
    queryKey: WALLET_KEYS.transactions(walletId),
    queryFn: () => getWallet(walletId),
    staleTime: 1000 * 60,
  })

  return computed<WalletResponseDtoType>(
    () =>
      data.value ?? {
        walletId: '',
        walletType: 'LOCAL',
        localCurrencyId: '',
        localCurrencyName: '',
        benefitType: 'INCENTIVE',
        percentage: 0,
        balance: 0,
        displayOrder: 0,
        backgroundImageUrl: '',
        maximum: 0,
      },
  )
}

export default useGetWallet
