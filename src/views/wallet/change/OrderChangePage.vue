<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showErrorToast } from '@/utils/toast'

import Layout from '@/components/layout/Layout.vue'
import WalletItem from '@/components/common/wallet/WalletItem.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import draggable from 'vuedraggable'

import updateWalletOrder from '@/composables/queries/wallet/usePatchWalletOrder'
import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import type { WalletOrderItem } from '@/types/wallet/WalletOrder'
import { useWalletStore } from '@/stores/useWalletStore'

const router = useRouter()
const walletStore = useWalletStore()

const sortedLocalWallets = computed(() => walletStore.sortedLocalWallets)

interface WalletCard {
  walletId: string
  localCurrencyName: string
  balance: number
  displayOrder: number
  bgColorClass: string
  walletType: 'CASH' | 'LOCAL'
}

const cards = ref<WalletCard[]>([])
const isDragging = ref(false)
const hasUnsavedChanges = ref(false)
const isInitialized = ref(false)

const convertToWalletCards = (wallets: WalletResponseDtoType[]): WalletCard[] => {
  return wallets.map((wallet) => ({
    walletId: wallet.walletId,
    localCurrencyName: wallet.localCurrencyName,
    balance: wallet.balance,
    displayOrder: wallet.displayOrder,
    bgColorClass: walletStore.getWalletColor(wallet.walletId),
    walletType: wallet.walletType,
  }))
}

watchEffect(() => {
  if (sortedLocalWallets.value.length > 0 && !isDragging.value && !hasUnsavedChanges.value) {
    cards.value = convertToWalletCards(sortedLocalWallets.value)
    isInitialized.value = true
  }
})

const onDragStart = () => {
  isDragging.value = true
}

const onDragEnd = () => {
  isDragging.value = false
  hasUnsavedChanges.value = true
}

const saveOrder = async () => {
  const walletOrderList: WalletOrderItem[] = cards.value.map((card, index) => ({
    walletId: card.walletId,
    displayOrder: index + 2,
  }))

  try {
    await updateWalletOrder(walletOrderList)

    walletStore.updateLocalWalletsOrder(walletOrderList)

    await nextTick()

    hasUnsavedChanges.value = false

    showSuccessToast('저장 완료!')

    router.push('/order')
  } catch (error) {
    showErrorToast('저장에 실패했어요.')
    hasUnsavedChanges.value = false
  }
}
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="'설정'"
    :show-left-icon="true"
    :show-right-icon="false"
    :is-bottom-nav="false"
  >
    <template #content>
      <div class="flex flex-col h-full px-[1.5rem] py-[2rem] bg-Background">
        <div class="flex-1 overflow-y-auto">
          <div class="mb-[1rem] Body04 text-Black2">지갑 순서를 바꿔보세요</div>

          <draggable
            v-model="cards"
            item-key="walletId"
            handle=".drag-handle"
            class="flex flex-col gap-[1rem] pb-[1.5rem] mt-[1rem]"
            animation="200"
            ghost-class="drag-ghost"
            @start="onDragStart"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <wallet-item
                :name="element.localCurrencyName"
                :balance="element.balance"
                :bgColorClass="element.bgColorClass"
                :showMenu="true"
              />
            </template>
          </draggable>
        </div>

        <div class="pt-[1rem]">
          <danji-button variant="large" :disabled="!hasUnsavedChanges" @click="saveOrder">
            저장하기
          </danji-button>
        </div>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.drag-ghost {
  opacity: 0.3;
}
</style>
