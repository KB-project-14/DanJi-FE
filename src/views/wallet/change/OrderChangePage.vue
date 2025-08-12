<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import Layout from '@/components/layout/Layout.vue'
import WalletItem from '@/components/common/wallet/WalletItem.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import draggable from 'vuedraggable'

import useGetWalletList from '@/composables/queries/wallet/useGetWalletList'
import updateWalletOrder from '@/composables/queries/wallet/usePatchWalletOrder'

import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import type { WalletOrderItem } from '@/types/wallet/WalletOrder'
import { useWalletStore } from '@/stores/useWalletStore'
import useHomeCardList from '@/composables/home/useHomeCardList'

const router = useRouter()
const walletStore = useWalletStore()

// 데이터 로딩을 위해 useHomeCardList 사용
const sortedLocalWallets = computed(() => walletStore.sortedLocalWallets)

// 화면에서 사용할 카드 타입
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

// 원본 데이터를 화면용 카드로 변환하는 함수
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

// 데이터가 변경될 때마다 카드 목록 업데이트
watchEffect(() => {
  if (sortedLocalWallets.value.length > 0 && !isDragging.value && !hasUnsavedChanges.value) {
    cards.value = convertToWalletCards(sortedLocalWallets.value)
    isInitialized.value = true
  }
})

// 드래그 시작
const onDragStart = () => {
  isDragging.value = true
}

// 드래그 끝
const onDragEnd = () => {
  isDragging.value = false
  hasUnsavedChanges.value = true
}

// 순서 저장
const saveOrder = async () => {
  // 현재 카드 순서대로 displayOrder 부여
  const walletOrderList: WalletOrderItem[] = cards.value.map((card, index) => ({
    walletId: card.walletId,
    // 백엔드 로직에 따라 2부터 순서 반영
    displayOrder: index + 2,
  }))

  try {
    await updateWalletOrder(walletOrderList)

    // 성공 시 스토어의 로컬 지갑 순서 업데이트
    walletStore.updateLocalWalletsOrder(walletOrderList)

    await nextTick()

    // 저장 후 상태 초기화
    hasUnsavedChanges.value = false

    alert('저장 완료!')

    router.push('/order')
  } catch (error) {
    console.error('순서 저장 실패:', error)
    alert('저장에 실패했어요.')
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
