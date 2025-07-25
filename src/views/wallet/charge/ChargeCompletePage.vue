<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import ChargeSuccess from '@/components/wallet/modal/ChargeSuccess.vue'
import ChargeFail from '@/components/wallet/modal/ChargeFail.vue'

const route = useRoute()
const chargeSuccess = computed(() => route.query.success === 'true')

const goWallet = () => {
  // 라우터 사용 시
  // router.push('/wallet')
  console.log('지갑으로 이동')
}
</script>

<template>
  <Layout :header-type="'basic'" :header-title="'충전 완료'" :is-bottom-nav="false">
    <template #content>
      <div class="relative flex flex-col items-center h-full px-[2rem] pt-[6rem] bg-Gray-0">
        <!-- 충전 성공 -->
        <charge-success v-if="chargeSuccess" />

        <!-- 충전 실패 -->
        <charge-fail v-else />

        <!-- 하단 버튼 -->
        <danji-button class="absolute bottom-0 w-[34.3rem] h-[5.8rem] mb-[3rem]" @click="goWallet">
          지갑으로 가기
        </danji-button>
      </div>
    </template>
  </Layout>
</template>
