<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import WalletItem from '@/components/common/wallet/WalletItem.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import draggable from 'vuedraggable'

import useGetWalletList from '@/composables/queries/wallet/getWalletList'
import updateWalletOrder from '@/composables/queries/wallet/patchWalletOrder'

// 원본 DTO 타입
interface WalletResponseDtoType {
  walletId: string
  walletType: 'CASH' | 'LOCAL'
  localCurrencyId: string
  localCurrencyName: string
  benefitType: string
  percentage: number
  balance: number
  displayOrder: number
  backgroundImageUrl?: string | null
  maximum?: number
}

// 화면에서 사용할 카드 타입
interface WalletCard {
  walletId: string
  localCurrencyName: string
  balance: number
  displayOrder: number
  bgColorClass: string
}

// 순서 변경 API용 타입
interface WalletOrderItem {
  walletId: string
  displayOrder: number
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
    displayOrder: index + 1,
  }))
  walletOrderList.forEach((item) => {
    const wallet = cards.value.find((w) => w.walletId === item.walletId)
  })
  try {
    await updateWalletOrder(walletOrderList)

    // 성공 시: 저장된 순서로 화면 업데이트
    cards.value = cards.value.map((card, index) => ({
      ...card,
      displayOrder: index,
    }))

    // 저장 후 상태 초기화
    hasUnsavedChanges.value = false

    alert('저장 완료!')

    // 데이터 새로고침
  } catch (error) {
    // CORS 에러 등 네트워크 오류 처리
    console.error('순서 저장 실패:', error)

    console.log('전송한 데이터:', walletOrderList)

    // 에러 발생 시에도 로컬에서는 순서 유지
    // 백엔드 연결이 안 될 때 임시로 화면만 업데이트
    cards.value = cards.value.map((card, index) => ({
      ...card,
      displayOrder: index + 1,
    }))
    hasUnsavedChanges.value = false
  }
}
</script>

<template>
  <Layout
    :header-type="'setting'"
    :header-title="'설정'"
    :show-left-icon="true"
    :show-right-icon="true"
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
