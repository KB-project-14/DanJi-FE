import { useWalletStore } from '@/stores/useWalletStore'
import useGetWalletList from '@/composables/queries/wallet/useGetWalletList'
import { computed, watch } from 'vue'

export default function useHomeCardList() {
  const walletStore = useWalletStore()

  const localWallets = useGetWalletList('LOCAL')
  const cashWallets = useGetWalletList('CASH')

  watch(
    localWallets,
    (newLocalWallets) => {
      if (newLocalWallets?.length) {
        walletStore.setLocalWallets(newLocalWallets)
      }
    },
    { immediate: true },
  )

  watch(
    cashWallets,
    (newCashWallets) => {
      if (newCashWallets?.length > 0) {
        walletStore.setCashWallet(newCashWallets[0])
      }
    },
    { immediate: true },
  )

  const allWallets = computed(() => walletStore.allWallets)

  const sortedLocalWallets = computed(() => walletStore.sortedLocalWallets)

  const localWalletCount = computed(() => walletStore.localWalletCount)

  return {
    allWallets,
    sortedLocalWallets,
    localWalletCount,
    localWallets,
    cashWallets,
  }
}
