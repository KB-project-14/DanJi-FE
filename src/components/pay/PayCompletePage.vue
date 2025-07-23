<script setup lang="ts">
import { ref } from 'vue'
import Layout from '../layout/Layout.vue'
import DanjiButton from '../common/button/DanjiButton.vue'
import PaySuccess from '../pay/PaySuccess.vue'
import PayFail from '../pay/PayFail.vue'

const paySuccess = ref<boolean | null>(null) // null: 초기상태, true: 성공, false: 실패

const handlePayment = () => {
  // 추후 API 호출 결과로 렌더링
  paySuccess.value = true // 예시(성공)
}
</script>
<template>
  <Layout :header-type="'basic'" :header-title="'결제하기'" :is-bottom-nav="false">
    <template #content>
      <div class="relative flex flex-col items-center h-full px-[2rem] pt-[6rem] bg-Gray-0">
        <!-- 결제 성공 -->
        <PaySuccess v-if="paySuccess === true" />

        <!-- 결제 실패 -->
        <PayFail v-else />
        <DanjiButton class="absolute bottom-0 w-[34.3rem] h-[5.8rem] mb-[3rem]"
          >지갑으로 가기</DanjiButton
        >
      </div>
    </template>
  </Layout>
</template>
<style scoped></style>
