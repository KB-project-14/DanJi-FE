<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import TotalWallet from '@/components/wallet/TotalWallet.vue'
import HasCardSection from '@/components/wallet/HasCardSection.vue'
import NoCardSection from '@/components/wallet/NoCardSection.vue'

const hasCard = true
const cards = [
  { id: 1, balance: 32000, backgroundImageUrl: '/', order: 1 },
  { id: 2, balance: 15000, backgroundImageUrl: '/', order: 2 },
  { id: 3, balance: 25000, backgroundImageUrl: '/', order: 3 },
]
</script>

<template>
  <Layout :header-type="'main'" header-title="메인" :is-bottom-nav="true">
    <template #content>
      <div class="bg-[#F3F4F7] min-h-full">
        <!-- 통합지갑 section -->
        <div class="pt-10 flex justify-center">
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
