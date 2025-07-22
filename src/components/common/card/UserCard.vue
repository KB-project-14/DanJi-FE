<script setup lang="ts">
defineProps<{
  balance: number
  backgroundImageUrl: string
}>()
</script>

<template>
  <div
    class="relative w-full h-48 max-w-sm mx-auto rounded-xl border border-[#d9d9d9] bg-cover bg-center"
    :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
  >
    <!-- 오른쪽 하단 금액 표시 -->
    <div
      class="absolute bottom-2 right-3 py-1 px-3 bg-white text-Brown-4 Head02 rounded border border-gray-300"
    >
      남은 금액: {{ balance.toLocaleString() }}원
    </div>
  </div>
</template>

<style scoped></style>
