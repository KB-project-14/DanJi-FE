<script setup lang="ts">
import { useRouter } from 'vue-router'
import fail from '@/assets/icons/fail.svg'

const router = useRouter()
const emit = defineEmits<{ close: [] }>()

function goLogin() {
  emit('close')
  router.push('/login')
}
function closeOnly() {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-[1000] flex items-center justify-center">
    <!-- 오버레이 -->
    <div class="absolute inset-0 bg-black/50 z-[1000]" />

    <!-- 모달 박스 -->
    <div
      class="z-[1001] flex flex-col items-center justify-center rounded-[1.6rem] bg-white px-8 py-8 w-[36rem] max-w-[90vw] shadow-xl"
    >
      <!-- 아이콘 -->
      <img class="w-[5rem] h-[5rem] mb-4" :src="fail" alt="게스트-권한-실패-아이콘" />

      <!-- 메시지 -->
      <p class="text-center text-[1.6rem] font-medium">로그인이 필요한 서비스입니다.</p>
      <p class="text-center text-[1.6rem] font-medium mb-6">로그인 후 이용해주세요.</p>

      <!-- 버튼 영역 -->
      <div class="flex gap-3 w-full">
        <button class="flex-1 py-3 rounded-xl bg-[#4e3d31] text-white font-medium" @click="goLogin">
          로그인
        </button>
        <button
          class="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium"
          @click="closeOnly"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
