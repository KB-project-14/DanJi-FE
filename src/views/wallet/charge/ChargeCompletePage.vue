<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import ChargeSuccess from '@/components/wallet/modal/ChargeSuccess.vue'
import ChargeFail from '@/components/wallet/modal/ChargeFail.vue'

const route = useRoute()
const router = useRouter()

const chargeSuccess = computed(() => route.query.success === 'true')

const goWallet = () => {
  // 지갑으로 이동
  router.push('/home')
}
const retryCharge = () => {
  // 전 페이지로 이동
  router.back()
}
</script>

<template>
  <Layout :header-type="'basic'" :header-title="'충전 완료'" :is-bottom-nav="false">
    <template #content>
      <div class="relative flex flex-col items-center h-full pt-[6rem] px-[2rem] bg-Gray-0">
        <!-- 충전 성공 -->
        <charge-success v-if="chargeSuccess" />

        <!-- 충전 실패 -->
        <charge-fail v-else />

        <!-- 하단 버튼 -->
        <!-- 성공일 때: 버튼 1개 -->
        <danji-button
          v-if="chargeSuccess"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[34.3rem] h-[5.8rem] mb-[3rem]"
          @click="goWallet"
        >
          지갑으로 가기
        </danji-button>

        <!-- 실패일 때: 버튼 2개 -->
        <div
          v-else
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[34.3rem] mb-[3rem] flex gap-3"
        >
          <danji-button
            class="!px-[0.5rem] !py-[0.5rem] flex-1 h-[5.8rem] whitespace-nowrap text-center"
            variant="smallOutline"
            @click="retryCharge"
          >
            다시 충전하기
          </danji-button>

          <danji-button
            class="!px-[0.5rem] !py-[0.5rem] flex-1 h-[5.8rem] whitespace-nowrap text-center"
            variant="small"
            @click="goWallet"
          >
            지갑으로 가기
          </danji-button>
        </div>
      </div>
    </template>
  </Layout>
</template>
