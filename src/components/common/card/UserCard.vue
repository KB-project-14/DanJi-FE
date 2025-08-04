<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  id: string
  balance: number
  backgroundImageUrl: string
}>()

const router = useRouter()

const goToHistory = () => {
  router.push(`/card/history/${props.id}`)
}
</script>

<template>
  <!-- 카드 이미지 추후 덮을 예정 -->
  <div
    class="relative w-full aspect-[1586/1000] mx-auto rounded-xl bg-cover bg-center border border-solid border-Gray-3"
    :style="{ backgroundImage: `url(${props.backgroundImageUrl})` }"
    @click="goToHistory"
  >
    <!-- 오른쪽 하단 잔액  -->
    <div class="absolute bottom-2 right-3 py-1 px-3 bg-white text-Brown-4 Head02 rounded">
      남은 금액: {{ props.balance.toLocaleString() }} 원
    </div>
  </div>
</template>

<style scoped></style>
