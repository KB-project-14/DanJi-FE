<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import TotalWallet from '@/components/wallet/TotalWallet.vue'

const hasCard = true
</script>

<template>
  <Layout :header-type="'main'" :is-bottom-nav="true">
    <template #content>
      <div class="bg-[#F3F4F7] min-h-full">
        <!-- 통합지갑 section -->
        <div class="pr-20 pl-20 pt-14">
          <TotalWallet :wallet-amount="82000" :total-asset="582000" />
        </div>
        <!-- 나의 지역화폐카드 section -->
        <div class="pr-20 pl-20 pt-20 pb-10">
          <!-- 카드 갯수 및 순서 편집 -->
          <div>
            <div>나의 카드 개</div>
          </div>
          <!-- 내가 가진 카드 -->
          <div>
            <UserCard :balance="32000" backgroundImageUrl="/" />
          </div>
          <!-- 혜택 안내 -->
          <div></div>
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
