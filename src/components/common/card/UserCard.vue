<script setup lang="ts">
defineProps<{
  balance: number
  backgroundImageUrl: string
}>()
</script>

<template>
  <!-- 카드  -->
  <div
    class="relative w-full aspect-[1586/1000] mx-auto rounded-xl bg-cover bg-center"
    :style="{
      backgroundImage: `url(${backgroundImageUrl})`,
      border: '1px solid #d9d9d9',
    }"
  >
    <!-- 오른쪽 하단 잔액 표시 -->
    <div class="absolute bottom-2 right-3 py-1 px-3 bg-white text-Brown-4 Head02 rounded">
      남은 금액: {{ balance.toLocaleString() }} 원
    </div>
  </div>
</template>

<style scoped></style>
