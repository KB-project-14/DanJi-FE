<script setup lang="ts">
defineProps<{
  balance: number
  backgroundImageUrl: string
}>()
</script>

<template>
  <!-- 카드 이미지 추후 덮을 예정 -->
  <div
    class="relative w-full aspect-[1586/1000] mx-auto rounded-xl bg-cover bg-center border border-solid border-Gray-3"
    :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
  >
    <!-- 오른쪽 하단 잔액  -->
    <div class="absolute bottom-2 right-3 py-1 px-3 bg-white text-Brown-4 Head02 rounded">
      남은 금액: {{ balance.toLocaleString() }} 원
    </div>
  </div>
</template>

<style scoped></style>
