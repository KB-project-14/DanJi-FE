<script setup lang="ts">
import DanjiButton from '../button/DanjiButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToChargePage = () => {
  router.push('/') // 임시로 홈 이동 설정(나중에 충전 페이지로 변경 예정)
}
</script>

<template>
  <div class="fixed inset-0 z-[1000] flex items-center justify-center">
    <!-- 오버레이 -->
    <div class="absolute inset-0 bg-black bg-opacity-50 z-[1000]" />

    <!-- 모달 박스 -->
    <div
      class="z-[1001] flex flex-col items-center justify-center w-[33.8rem] h-[23.9rem] rounded-[1.6rem] bg-White-0"
    >
      <div class="flex flex-col items-center justify-center space-y-2 mb-[3.1rem]">
        <span class="Head03">지역화폐 잔액이 부족해요.</span>
        <span class="Head03">지금 충전 페이지로 이동할게요.</span>
        <span class="Body01 text-Red-0">(※ 수수료 1%가 부과됩니다)</span>
      </div>
      <DanjiButton @click="goToChargePage">충전하러 가기</DanjiButton>
    </div>
  </div>
</template>

<style scoped></style>
