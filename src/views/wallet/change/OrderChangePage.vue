<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import Layout from '@/components/layout/Layout.vue'
import WalletItem from '@/components/common/wallet/WalletItem.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import draggable from 'vuedraggable'

import useGetWalletList from '@/composables/queries/wallet/getWalletList'
import updateWalletOrder from '@/composables/queries/wallet/patchWalletOrder'

import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import type { WalletOrderItem } from '@/types/wallet/WalletOrder'

const router = useRouter()

// 화면에서 사용할 카드 타입
interface WalletCard {
  walletId: string
  localCurrencyName: string
  balance: number
  displayOrder: number
  bgColorClass: string
}

// 색상 배열
const bgColors = [
  'bg-[#0078D7] text-White-1',
  'bg-[#77C3E4] text-White-1',
  'bg-[#C89E59] text-White-1',
  'bg-[#F1F1F1] text-Black-1',
  'bg-[#FF8A65] text-White-1',
]

const localWallets = useGetWalletList('LOCAL')
const cards = ref<WalletCard[]>([])
const isDragging = ref(false)
const hasUnsavedChanges = ref(false)

// 원본 데이터를 화면용 카드로 변환하는 함수
const convertToWalletCards = (wallets: WalletResponseDtoType[]): WalletCard[] => {
  const sorted = [...wallets].sort((a, b) => a.displayOrder - b.displayOrder)

  return sorted.map((wallet, index) => ({
    walletId: wallet.walletId,
    localCurrencyName: wallet.localCurrencyName,
    balance: wallet.balance,
    displayOrder: wallet.displayOrder,
    bgColorClass: bgColors[index % bgColors.length],
    walletType: wallet.walletType,
  }))
}

// 데이터가 변경될 때마다 카드 목록 업데이트
watchEffect(() => {
  if (localWallets.value.length > 0 && !isDragging.value && !hasUnsavedChanges.value) {
    cards.value = convertToWalletCards(localWallets.value)
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
  walletOrderList.forEach((item) => {
    const wallet = cards.value.find((w) => w.walletId === item.walletId)
  })
  try {
    await updateWalletOrder(walletOrderList)

    // 성공 시 저장된 순서로 화면 업데이트
    const sorted = [...cards.value].sort((a, b) => a.displayOrder - b.displayOrder)
    cards.value = sorted.map((card, index) => ({
      ...card,
      displayOrder: index,
    }))

    // 저장 후 상태 초기화
    hasUnsavedChanges.value = false
    alert('저장 완료!')

    router.push('/order').then(() => {
      window.location.reload()
    })
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
