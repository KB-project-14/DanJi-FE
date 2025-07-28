<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import WalletItem from '@/components/common/wallet/WalletItem.vue'
import Tooltip from '@/components/common/tooltip/Tooltip.vue'

interface WalletCard {
  id: number
  name: string
  balance: number
  bgColorClass: string
}

const cards: WalletCard[] = [
  {
    id: 1,
    name: '서울Pay',
    balance: 32000,
    bgColorClass: 'bg-[#0078D7] text-White-1',
  },
  {
    id: 2,
    name: '강원상품권',
    balance: 39400,
    bgColorClass: 'bg-[#77C3E4] text-White-1',
  },
  {
    id: 3,
    name: '동백전',
    balance: 39400,
    bgColorClass: 'bg-[#C89E59] text-White-1',
  },
  {
    id: 4,
    name: '부산Pay',
    balance: 39400,
    bgColorClass: 'bg-[#F1F1F1] text-Black-1',
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
        <div class="flex items-center justify-between p-[2rem] rounded-lg shadow-sm bg-White-1">
          <!-- 왼쪽 텍스트 -->
          <p class="Body00 text-Gray-4">
            사용자의 지역화폐 총 잔액은
            <span class="text-Blue-0"
              >{{ cards.reduce((sum, card) => sum + card.balance, 0).toLocaleString() }}원</span
            >
            입니다.
          </p>

          <!-- 툴팁 컴포넌트 -->
          <tooltip
            message="통합지갑을 제외한 나의 각 지역화폐카드 잔액을 한 눈에 볼 수 있습니다."
            position="bottom"
            align="end"
          />
        </div>

        <!-- 카드 리스트 -->
        <div class="flex flex-col gap-4 flex-1 p-4 rounded-lg shadow-sm bg-White-1">
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
