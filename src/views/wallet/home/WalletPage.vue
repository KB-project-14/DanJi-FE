<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import { HelpCircle } from 'lucide-vue-next'
import Layout from '@/components/layout/Layout.vue'
import WalletItem from '@/components/common/wallet/WalletItem.vue'

const showTooltip = ref(false)
const tooltipRef = ref<HTMLElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)

// 바깥 클릭 시 툴팁 닫기
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (
    tooltipRef.value &&
    !tooltipRef.value.contains(target) &&
    iconRef.value &&
    !iconRef.value.contains(target)
  ) {
    showTooltip.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

interface WalletCard {
  id: number
  name: string
  balance: number
  bgColorClass: string
}

const cards: WalletCard[] = [
  {
    id: 2,
    name: '울산페이',
    balance: 39400,
    bgColorClass: 'bg-[#77C3E4] text-white',
  },
  {
    id: 3,
    name: '강릉페이',
    balance: 39400,
    bgColorClass: 'bg-[#C89E59] text-white',
  },
  {
    id: 4,
    name: '부산페이',
    balance: 39400,
    bgColorClass: 'bg-[#F1F1F1] text-black',
  },
]
</script>

<template>
  <layout
    :header-type="'basic'"
    :header-title="'나의 지역화폐'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="flex flex-col h-full px-[1rem] py-[2.4rem] bg-Background gap-4">
        <!-- 상단 총 잔액 영역 -->
        <div class="bg-white rounded-lg shadow-sm p-[2rem] flex items-center justify-between">
          <!-- 왼쪽 텍스트 -->
          <p class="Body00 text-Gray-4">
            사용자의 지역화폐 총 잔액은
            <span class="text-Blue-0"
              >{{ cards.reduce((sum, card) => sum + card.balance, 0).toLocaleString() }}원</span
            >
            입니다.
          </p>

          <!-- 툴팁 아이콘 -->
          <div class="relative flex items-center">
            <HelpCircle
              ref="iconRef"
              class="w-[1.6rem] h-[1.6rem] text-Gray-5 cursor-pointer"
              @click.stop="showTooltip = !showTooltip"
            />

            <div
              v-if="showTooltip"
              ref="tooltipRef"
              @click.stop
              class="absolute rounded-md shadow z-50 top-full right-0 mt-[0.5rem] p-[1rem] w-max bg-Black-2 text-White-0 Body04"
            >
              통합지갑을 제외한 나의 각 지역화폐카드 잔액을 한 눈에 볼 수 있습니다.
            </div>
          </div>
        </div>

        <!-- 카드 리스트 -->
        <div class="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4 flex-1">
          <wallet-item
            v-for="card in cards"
            :key="card.id"
            :name="card.name"
            :balance="card.balance"
            :bgColorClass="card.bgColorClass"
            :showMenu="false"
          />
        </div>
      </div>
    </template>
  </layout>
</template>
