<script setup lang="ts">
const props = defineProps<{
  fromCard: { name: string; percentage: number }
  totalAmount: number
  result: { finalAmount: number; excludedIncentive: number }
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <div class="fixed inset-0 bg-Black-0 bg-opacity-50 flex items-center justify-center z-50">
    <div class="p-[2rem] w-[85%] max-w-[350px] shadow-lg bg-White-1 rounded-2xl">
      <h2 class="pb-[2.4rem] Head02 text-center">최종 환전 금액 확인</h2>

      <div class="flex items-center justify-between mb-[2rem]">
        <!-- From -->
        <div class="flex-1 rounded-xl py-[1.6rem] px-[1rem] bg-Gray-1 text-center">
          <p class="pb-[0.6rem] Body02">{{ props.fromCard.name }}</p>
          <p class="Body03 text-Gray-6 mb-[0.2rem]">
            환전 예정 금액:
            <span class="text-Yellow-1">{{ props.totalAmount.toLocaleString() }}원</span>
          </p>
          <p class="Body03 text-Gray-6">
            제외된 인센티브:
            <span class="text-Red-0">
              {{ props.result.excludedIncentive.toLocaleString() }}원
            </span>
          </p>
        </div>

        <div class="mx-2 flex items-center justify-center text-Gray-4">➡️</div>

        <!-- To (통합지갑) -->
        <div class="flex-1 bg-Gray-1 rounded-xl py-[1.6rem] px-[1rem] ml-2 text-center">
          <p class="pb-[0.6rem] Body02">통합지갑</p>
          <p class="Body03 text-Gray-6 mb-[0.2rem]">
            최종 충전 금액:
            <span class="text-Yellow-1">{{ props.result.finalAmount.toLocaleString() }}원</span>
          </p>
        </div>
      </div>

      <div class="mb-[2rem] text-center Head02">
        최종 환전 금액:
        <span class="text-Black-2">{{ props.result.finalAmount.toLocaleString() }}원</span>
      </div>

      <div class="flex gap-4">
        <button class="flex-1 py-3 border rounded-lg text-Gray-6" @click="emit('close')">
          취소
        </button>
        <button class="flex-1 py-3 rounded-lg bg-Brown-4 text-white" @click="emit('confirm')">
          환전
        </button>
      </div>
    </div>
  </div>
</template>
