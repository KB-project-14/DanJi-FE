<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import ExchangeSuccess from '@/components/wallet/exchange/modal/ExchangeSuccess.vue'
import ExchangeFail from '@/components/wallet/exchange/modal/ExchangeFail.vue'

const route = useRoute()
const router = useRouter()

const exchangeSuccess = computed(() => route.query.success === 'true')

const goHome = () => {
  router.push('/home')
}

const retryExchange = () => {
  router.back()
}
</script>

<template>
  <Layout :header-type="'basic'" :header-title="'환전 완료'" :is-bottom-nav="false">
    <template #content>
      <div class="relative flex flex-col items-center h-full pt-[6rem] px-[2rem] bg-Gray-0">
        <!-- 환전 성공 -->
        <exchange-success v-if="exchangeSuccess" />

        <!-- 환전 실패 -->
        <exchange-fail v-else />

        <!-- 성공일 때 버튼 -->
        <danji-button
          v-if="exchangeSuccess"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[34.3rem] h-[5.8rem] mb-[3rem]"
          @click="goHome"
        >
          홈으로 가기
        </danji-button>

        <!-- 실패일 때 버튼 -->
        <div
          v-else
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[34.3rem] mb-[3rem] flex gap-3"
        >
          <danji-button
            class="!px-[0.5rem] !py-[0.5rem] flex-1 h-[5.8rem] whitespace-nowrap text-center"
            variant="smallOutline"
            @click="retryExchange"
          >
            다시 시도하기
          </danji-button>

          <danji-button
            class="!px-[0.5rem] !py-[0.5rem] flex-1 h-[5.8rem] whitespace-nowrap text-center"
            variant="small"
            @click="goHome"
          >
            홈으로 가기
          </danji-button>
        </div>
      </div>
    </template>
  </Layout>
</template>
