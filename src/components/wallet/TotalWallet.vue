<script setup lang="ts">
defineProps<{
  walletAmount: number
  totalAsset: number
}>()
</script>

<template>
  <div class="aspect-[1586/700] rounded-xl overflow-hidden w-full shadow mx-auto">
    <!-- 상단 영역: 통합지갑 잔액 -->
    <div class="flex flex-col items-start p-4 bg-Yellow-0/40">
      <span class="mb-1 Head4 text-Gray-6">통합지갑</span>
      <span class="self-center Head0 text-Black">{{ walletAmount.toLocaleString() }}원</span>
    </div>

    <!-- 하단 영역: 사용자님의 총 자산 -->
    <div class="bg-White-0/40 p-4">
      <span class="Body02 text-Black-2"
        >사용자님의 총 자산 {{ totalAsset.toLocaleString() }}원</span
      >
    </div>
  </div>
</template>

<style></style>
