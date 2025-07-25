<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import ChargeSuccess from '@/components/wallet/modal/ChargeSuccess.vue'
import ChargeFail from '@/components/wallet/modal/ChargeFail.vue'

const chargeSuccess = ref<boolean | null>(null) // null: 초기 상태, true: 성공, false: 실패

// 충전 결과 처리 (API 연동 예정)
const handleChargeResult = () => {
  // API 호출 후 성공/실패 값으로 변경
  // 예: 성공
  chargeSuccess.value = true
  // 예: 실패 시
  // chargeSuccess.value = false
}
handleChargeResult()

// 지갑으로 이동
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
        <ChargeSuccess v-if="chargeSuccess === true" />

        <!-- 충전 실패 -->
        <ChargeFail v-else-if="chargeSuccess === false" />

        <!-- 로딩/처리 중 상태 -->
        <div v-else class="flex items-center justify-center">
          <span class="Head03">충전 처리 중...</span>
        </div>

        <!-- 하단 버튼 -->
        <DanjiButton class="absolute bottom-0 w-[34.3rem] h-[5.8rem] mb-[3rem]" @click="goWallet">
          지갑으로 가기
        </DanjiButton>
      </div>
    </template>
  </Layout>
</template>

<style scoped></style>
