<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

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

const router = useRouter()

// 더미 카드 데이터
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

// order 기준으로 정렬
const sortedCards = computed(() => [...cards.value].sort((a, b) => a.order - b.order))

// 현재 카드 index값
const currentIndex = ref(0)

// 카드 클릭 시 히스토리 페이지 이동
const goCardHistory = (id: number) => {
  router.push(`/card/history/${id}`)
}

// 충전 버튼 클릭 시
const goCharge = () => {
  const selectedCard = sortedCards.value[currentIndex.value]
  router.push(`/card/charge/${selectedCard.id}`)
}

// 환전 버튼 클릭 시
const goExchange = () => {
  const selectedCard = sortedCards.value[currentIndex.value]
  router.push(`/card/exchange/${selectedCard.id}`)
}
</script>

<template>
  <Layout :header-type="'main'" header-title="메인" :is-bottom-nav="true">
    <template #content>
      <div class="min-h-full bg-Background">
        <!-- 통합지갑 -->
        <div class="flex justify-center pt-[3rem]">
          <div class="w-[270px]">
            <TotalWallet :wallet-amount="82000" :total-asset="582000" />
          </div>
        </div>

        <!-- 카드 리스트 -->
        <div class="pl-20 pt-[4rem] pb-[3rem] px-[1rem]">
          <HasCardSection
            v-if="true"
            :cards="sortedCards"
            @click-card="goCardHistory"
            @slide-change="currentIndex = $event"
          />
          <NoCardSection v-else />
        </div>

        <!-- 충전/환전 -->
        <div class="flex justify-center gap-10">
          <danji-button variant="small" @click="goCharge">충전</danji-button>
          <danji-button variant="small" @click="goExchange">환전</danji-button>
        </div>
      </div>
    </template>
  </Layout>
</template>
