<script setup lang="ts">
const props = defineProps<{
  incentiveText: string
  maxChargeAmount: number
}>()
</script>

<template>
  <div class="flex flex-col mt-[3rem] mx-[2.7rem]">
    <span class="Head01 text-Black-1">Benefits</span>
    <span class="mt-[0.3rem] Head04 text-Brown-2">{{ incentiveText }}</span>

    <div>
      <span class="Body02 text-Gray-5">최대 충전 가능 금액</span>
      <span class="ms-[0.5rem] Head04 text-Yellow-1">{{ maxChargeAmount.toLocaleString() }}원</span>
    </div>
  </div>
</template>
