<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  id: string
  balance: number
  backgroundImageUrl?: string | null
}>()

const router = useRouter()

const goToHistory = () => {
  router.push(`/card/history/${props.id}`)
}

// 배경 이미지 스타일 계산
const backgroundStyle = computed(() => {
  if (props.backgroundImageUrl) {
    return {
      backgroundImage: `url(http://danji.cloud${props.backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  // 기본 배경색 또는 그라데이션
  return {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }
})
</script>

<template>
  <!-- 카드 이미지  -->
  <div
    class="relative w-full aspect-[1586/1000] mx-auto rounded-xl border border-solid border-Gray-3"
    :style="backgroundStyle"
    @click="goToHistory"
    :class="{ 'has-bg': props.backgroundImageUrl }"
  >
    <!-- 오른쪽 하단 잔액  -->
    <div class="absolute bottom-2 right-3 py-1 px-3 bg-white text-Brown-4 Head02 rounded">
      남은 금액: {{ props.balance.toLocaleString() }} 원
    </div>
  </div>
</template>

<style scoped></style>
