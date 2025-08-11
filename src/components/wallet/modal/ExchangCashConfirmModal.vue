<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowDown } from 'lucide-vue-next'
import DanjiButton from '@/components/common/button/DanjiButton.vue'

const router = useRouter()

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
  <div class="fixed inset-0 flex items-center justify-center bg-Black-0 bg-opacity-50 z-50">
    <div class="p-[2rem] w-[85%] max-w-[350px] shadow-lg bg-White-1 rounded-2xl">
      <h2 class="pb-[2.4rem] Head02 text-center">최종 환전 금액 확인</h2>

      <div class="flex flex-col items-center mb-[2rem]">
        <!-- From -->
        <div
          class="w-full rounded-xl py-[1.6rem] px-[1rem] h-[9rem] bg-Gray-1 text-center mb-[1rem]"
        >
          <p class="pb-[0.6rem] Body02">{{ props.fromCard.name }}</p>
          <p class="mb-[0.2rem] Body03 text-Gray-6">
            환전 예정 금액:
            <span class="text-Black-1">{{ props.totalAmount.toLocaleString() }}원</span>
          </p>
          <p class="Body03 text-Gray-6">
            제외된 인센티브:
            <span class="text-Red-1">{{ props.result.excludedIncentive.toLocaleString() }}원</span>
          </p>
        </div>

        <div class="flex items-center justify-center w-[1.6rem] h-[1.6rem] text-Gray-4 mb-[1rem]">
          <ArrowDown />
        </div>

        <!-- To (통합지갑) -->
        <div class="w-full py-[1.6rem] px-[1rem] h-[9rem] bg-Gray-1 rounded-xl text-center">
          <p class="pb-[0.6rem] Body02">통합지갑</p>
          <p class="mt-[0.8rem] Body03 text-Gray-6">
            최종 충전 금액:
            <span class="text-Black-1">{{ props.result.finalAmount.toLocaleString() }}원</span>
          </p>
        </div>
      </div>

      <div class="mb-[2rem] text-center Head02">
        최종 환전 금액:
        <span class="text-Red-1">{{ props.result.finalAmount.toLocaleString() }}원</span>
      </div>

      <div class="w-full max-w-[34.3rem] flex gap-3">
        <danji-button
          class="flex-1 !px-[0.5rem] !py-[0.4rem] h-[5rem] whitespace-nowrap text-center"
          variant="smallOutline"
          @click="emit('close')"
        >
          취소
        </danji-button>

        <danji-button
          class="flex-1 !px-[0.5rem] !py-[0.5rem] h-[5rem] whitespace-nowrap text-center"
          variant="small"
          @click="emit('confirm')"
        >
          환전
        </danji-button>
      </div>
    </div>
  </div>
</template>
