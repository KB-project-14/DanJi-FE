<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import TotalWallet from '@/components/wallet/TotalWallet.vue'
import HasCardSection from '@/components/wallet/HasCardSection.vue'
import NoCardSection from '@/components/wallet/NoCardSection.vue'

interface Card {
  id: number
  name: string
  balance: number
  backgroundImageUrl: string
  order: number
  benefit_type: string
  percentage: number
}

const hasCard = true

const cards = ref<Card[]>([
  {
    id: 1,
    name: '동백전',
    balance: 32000,
    backgroundImageUrl: '/',
    order: 3,
    benefit_type: '캐시백',
    percentage: 10,
  },
  {
    id: 2,
    name: '서울Pay',
    balance: 15000,
    backgroundImageUrl: '/',
    order: 1,
    benefit_type: '캐시백',
    percentage: 5,
  },
  {
    id: 3,
    name: '강원상품권',
    balance: 25000,
    backgroundImageUrl: '/',
    order: 2,
    benefit_type: '인센티브',
    percentage: 7,
  },
  {
    id: 4,
    name: '부산Pay',
    balance: 25000,
    backgroundImageUrl: '/',
    order: 4,
    benefit_type: '인센티브',
    percentage: 8,
  },
])
</script>

<template>
  <Layout :header-type="'main'" header-title="메인" :is-bottom-nav="true">
    <template #content>
      <div class="min-h-full bg-background">
        <!-- 통합지갑 section -->
        <div class="flex justify-center pt-10">
          <div class="w-[270px]">
            <TotalWallet :wallet-amount="82000" :total-asset="582000" />
          </div>
        </div>
        <!-- 나의 지역화폐카드 -->
        <div class="pl-20 pt-20 pb-10 px-4">
          <HasCardSection v-if="hasCard" :cards="cards" />
          <NoCardSection v-else />
        </div>
        <!-- 버튼 -->
        <div class="flex justify-center gap-10">
          <danji-button variant="small">충전</danji-button>
          <danji-button variant="small">전환</danji-button>
        </div>
      </div>
    </template>
  </Layout>
</template>
