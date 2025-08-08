<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import PaySuccess from '@/components/pay/PaySuccess.vue'
import PayFail from '@/components/pay/PayFail.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const paySuccess = ref<boolean | null>(null)

onMounted(() => {
  const state = history.state

  if (state?.status === 'success') {
    paySuccess.value = true
  } else if (state?.status === 'failed') {
    paySuccess.value = false
  } else {
    router.push('/home')
  }
})

const onClickWallet = () => {
  router.push('/home')
}
</script>
<template>
  <layout :header-type="'basic'" :header-title="'결제하기'" :is-bottom-nav="false">
    <template #content>
      <div class="relative flex flex-col items-center h-full px-[2rem] pt-[6rem] bg-Gray-0">
        <!-- 결제 성공 -->
        <PaySuccess v-if="paySuccess === true" />

        <!-- 결제 실패 -->
        <PayFail v-else-if="paySuccess === false" />

        <!-- (null)초기 상태 또는 로딩 상태 -->
        <div v-else class="flex items-center justify-center">
          <span class="Head03">결제 처리 중...</span>
        </div>
        <DanjiButton
          class="absolute bottom-0 w-[34.3rem] h-[5.8rem] mb-[3rem]"
          @click="onClickWallet"
          >지갑으로 가기</DanjiButton
        >
      </div>
    </template>
  </layout>
</template>
<style scoped></style>
