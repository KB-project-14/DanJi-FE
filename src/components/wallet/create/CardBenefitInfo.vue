<script setup lang="ts">
const props = defineProps<{
  /**
   * 인센티브 혜택 텍스트
   */
  incentiveText: string

  /**
   * 최대 충전 가능 금액
   */
  maxChargeAmount: string
}>()
</script>

<template>
  <div class="flex flex-col mt-[3rem] mx-[2.7rem]">
    <!-- 혜택 섹션 -->
    <span class="Head01 text-Black-1">Benefits</span>
    <span class="mt-[0.3rem] Head04 text-Brown-2">{{ incentiveText }}</span>

    <!-- 최대 충전 금액 -->
    <div>
      <span class="Body02 text-Gray-5">최대 충전 가능 금액</span>
      <span class="ms-[0.5rem] Head04 text-Yellow-1">{{ maxChargeAmount }}원</span>
    </div>
  </div>
</template>
