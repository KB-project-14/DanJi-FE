import { useWalletStore } from '@/stores/useWalletStore'
import useGetWalletList from '../queries/wallet/getWalletList'
import { computed, watch } from 'vue'

export default function useHomeCardList() {
  const walletStore = useWalletStore()

  const localWallets = useGetWalletList('LOCAL')
  const cashWallets = useGetWalletList('CASH')

  // 지역화폐 지갑 목록 스토어에 업데이트
  watch(
    localWallets,
    (newLocalWallets) => {
      if (newLocalWallets?.length) {
        walletStore.setLocalWallets(newLocalWallets)
      }
    },
    { immediate: true },
  )

  // 현금 지갑 정보 스토어에 업데이트
  watch(
    cashWallets,
    (newCashWallets) => {
      if (newCashWallets?.length > 0) {
        walletStore.setCashWallet(newCashWallets[0])
      }
    },
    { immediate: true },
  )

  // 모든 지갑 목록
  const allWallets = computed(() => walletStore.allWallets)

  // 정렬된 지역화폐 지갑 목록
  const sortedLocalWallets = computed(() => walletStore.sortedLocalWallets)

  // 지역화폐 개수
  const localWalletCount = computed(() => walletStore.localWalletCount)

  return {
    allWallets,
    sortedLocalWallets,
    localWalletCount,
    localWallets,
    cashWallets,
  }
}
