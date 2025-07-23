<script setup lang="ts">
import DanjiButton from '../button/DanjiButton.vue'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()

const goToChargePage = () => {
  emit('close') // 모달 닫기 이벤트 발생
  router.push('/') // 임시로 홈 이동 설정(나중에 충전 페이지로 변경 예정)
}
</script>

<template>
  <div
    class="fixed inset-0 z-[1000] flex items-center justify-center"
    @keydown.esc="emit('close')"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-label="지역화폐 잔액 부족 안내"
  >
    <!-- 오버레이 -->
    <div class="absolute inset-0 bg-Black-1 bg-opacity-50 z-[1000]" />

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
