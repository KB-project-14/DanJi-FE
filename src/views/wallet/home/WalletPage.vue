<script setup lang="ts">
import { computed } from 'vue'

import Layout from '@/components/layout/Layout.vue'
import WalletItem from '@/components/common/wallet/WalletItem.vue'
import Tooltip from '@/components/common/tooltip/Tooltip.vue'

import useGetWalletList from '@/composables/queries/wallet/useGetWalletList'

const localWallets = useGetWalletList('LOCAL')

// 카드 총 잔액 계산
const totalBalance = computed(() =>
  (localWallets.value ?? []).reduce((sum, card) => sum + (card.balance || 0), 0),
)

// 색상 배열 (순서 고정)
const bgColors = [
  'bg-[#0078D7] text-White-1',
  'bg-[#77C3E4] text-White-1',
  'bg-[#C89E59] text-White-1',
  'bg-[#F1F1F1] text-Black-1',
  'bg-[#FF8A65] text-White-1',
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
          <p class="Body00 text-Gray-4">
            사용자의 지역화폐 총 잔액은
            <span class="text-Blue-0">{{ totalBalance.toLocaleString() }}원</span>
            입니다.
          </p>

          <tooltip
            message="통합지갑을 제외한 나의 각 지역화폐카드 잔액을 한 눈에 볼 수 있습니다."
            position="bottom"
            align="end"
          />
        </div>

        <!-- 카드 리스트 -->
        <div class="flex flex-col gap-4 flex-1 p-4 rounded-lg shadow-sm bg-White-1">
          <wallet-item
            v-for="(card, index) in localWallets"
            :key="card.walletId"
            :name="card.localCurrencyName"
            :balance="card.balance"
            :bgColorClass="bgColors[index % bgColors.length]"
            :showMenu="false"
          />
        </div>
      </div>
    </template>
  </layout>
</template>
