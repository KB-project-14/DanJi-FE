<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import TotalWallet from '@/components/wallet/TotalWallet.vue'
import HasCardSection from '@/components/wallet/HasCardSection.vue'
import NoCardSection from '@/components/wallet/NoCardSection.vue'

const hasCard = false
const cards = [
  { balance: 32000, backgroundImageUrl: '/' },
  { balance: 15000, backgroundImageUrl: '/' },
]
</script>

<template>
  <Layout :header-type="'main'" :is-bottom-nav="true">
    <template #content>
      <div class="bg-[#F3F4F7] min-h-full">
        <!-- 통합지갑 section -->
        <div class="pr-20 pl-20 pt-14">
          <TotalWallet :wallet-amount="82000" :total-asset="582000" />
        </div>
        <!-- 나의 지역화폐카드 -->
        <div class="pt-20 pb-10 pl-20">
          <HasCardSection v-if="hasCard" :cards="cards" />
          <NoCardSection v-else class="pl-20 pr-20" />
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
