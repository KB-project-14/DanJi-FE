<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import PaySuccess from '@/components/pay/PaySuccess.vue'
import PayFail from '@/components/pay/PayFail.vue'

const paySuccess = ref<boolean | null>(null) // null: 초기상태, true: 성공, false: 실패

const handlePayment = () => {
  // 추후 API 호출 결과로 렌더링
  paySuccess.value = true // 예시(성공)
}
</script>
<template>
  <Layout
    :header-type="'basic'"
    :header-title="'충전하기'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="relative flex flex-col items-center h-full px-[2rem] pt-[6rem] bg-Gray-0">
        <!-- 결제 성공 -->
        <PaySuccess v-if="paySuccess === true" />

        <!-- 결제 실패 -->
        <PayFail v-else-if="paySuccess === false" />

        <!-- (null 상태)초기 상태 또는 로딩 상태 -->
        <div v-else class="flex items-center justify-center">
          <span class="Head03">결제 처리 중...</span>
        </div>
        <DanjiButton class="absolute bottom-0 w-[34.3rem] h-[5.8rem] mb-[3rem]"
          >지갑으로 가기</DanjiButton
        >
      </div>
    </template>
  </Layout>
</template>
<style scoped></style>
