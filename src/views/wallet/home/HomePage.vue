<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import TotalWallet from '@/components/wallet/TotalWallet.vue'
import HasCardSection from '@/components/wallet/HasCardSection.vue'
import NoCardSection from '@/components/wallet/NoCardSection.vue'

import useGetWalletList from '@/composables/queries/wallet/useGetWalletList'

const router = useRouter()

// 통합지갑 (CASH)
const cashWallets = useGetWalletList('CASH')
const cashBalance = computed(() => cashWallets.value?.[0]?.balance || 0)

// 로컬카드 (LOCAL)
const localWallets = useGetWalletList('LOCAL')

// 카드 정렬 (displayOrder 기준)
const sortedCards = computed(() =>
  (localWallets.value ? [...localWallets.value] : []).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  ),
)

// 현재 카드 index값
const currentIndex = ref(0)

// 카드 클릭 시 히스토리 페이지 이동
const goCardHistory = (id: string) => {
  router.push(`/card/history/${id}`)
}

// 충전 버튼 클릭 시
const goCharge = () => {
  const selectedCard = sortedCards.value[currentIndex.value]
  if (selectedCard) router.push(`/card/charge/${selectedCard.walletId}`)
}

// 환전 버튼 클릭 시
const goExchange = () => {
  const selectedCard = sortedCards.value[currentIndex.value]
  if (selectedCard) router.push(`/card/exchange/${selectedCard.walletId}`)
}
</script>

<template>
  <Layout :header-type="'main'" header-title="메인" :is-bottom-nav="true">
    <template #content>
      <div class="min-h-full bg-Background">
        <!-- 통합지갑 -->
        <div class="flex justify-center pt-[3rem]">
          <div class="w-[270px]">
            <total-wallet :wallet-amount="cashBalance" />
          </div>
        </div>

        <!-- 카드 리스트 -->
        <div class="pl-20 pt-[4rem] pb-[3rem] px-[1rem]">
          <has-card-section
            v-if="sortedCards.length > 0"
            :cards="sortedCards"
            @click-card="goCardHistory"
            @slide-change="currentIndex = $event"
          />
          <no-card-section v-else />
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
