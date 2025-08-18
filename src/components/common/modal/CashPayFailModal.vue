<script setup lang="ts">
import DanjiButton from '../button/DanjiButton.vue'
import { useRouter } from 'vue-router'
import fail from '@/assets/icons/fail.svg'

const router = useRouter()
const emit = defineEmits<{
  close: []
}>()

const goToChargePage = () => {
  emit('close')
  router.push('/')
}
</script>

<template>
  <div class="fixed inset-0 z-[1000] flex items-center justify-center">
    <div class="absolute inset-0 bg-Black-1 bg-opacity-50 z-[1000]" />

    <div
      class="z-[1001] flex flex-col items-center justify-center w-[33.8rem] h-[23.9rem] rounded-[1.6rem] bg-White-0"
    >
      <div class="flex flex-col items-center justify-center mb-[1.2rem]">
        <img
          class="w-[5.4rem] h-[5.4rem] mb-[1.2rem]"
          :src="fail"
          alt="통합지갑-결제-실패-아이콘"
        />
        <span class="Head03">통합지갑의 잔액이 부족합니다.</span>
        <span class="Head03">확인해주세요.</span>
      </div>
      <DanjiButton class="w-[21.4rem] h-[5.8rem]" @click="goToChargePage">확인</DanjiButton>
    </div>
  </div>
</template>

<style scoped></style>
