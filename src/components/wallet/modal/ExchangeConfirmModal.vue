<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const props = defineProps<{
  fromCard: {
    name: string
    chargedAmount: number
    incentiveAmount: number
  }
  toCard: {
    name: string
    chargedAmount: number
    incentiveAmount: number
  }
  totalAmount: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <!-- 배경 -->
  <div class="fixed inset-0 bg-Black-0 bg-opacity-50 flex items-center justify-center z-50">
    <!-- 모달 박스 -->
    <div class="p-[2rem] w-[85%] max-w-[350px] shadow-lg bg-White-1 rounded-2xl">
      <!-- 제목 -->
      <h2 class="pb-[2.4rem] Head02 text-center">최종 환전 금액 확인</h2>

      <!-- 카드 비교 영역 -->
      <div class="flex items-center justify-between mb-[2rem]">
        <!-- From 카드 -->
        <div class="flex-1 rounded-xl py-[1.6rem] px-[1rem] bg-Gray-1 text-center">
          <p class="pb-[0.6rem] Body02">{{ props.fromCard.name }}</p>
          <p class="Body03 text-Gray-6 mb-[0.2rem]">
            충전 금액:
            <span class="text-Yellow-1">{{ props.fromCard.chargedAmount.toLocaleString() }}원</span>
          </p>
          <p class="Body03 text-Gray-6 mb-[0.2rem]">
            인센티브(10%):
            <span class="text-Yellow-1"
              >{{ props.fromCard.incentiveAmount.toLocaleString() }}원</span
            >
          </p>
        </div>

        <div class="mx-2 flex items-center justify-center text-Gray-4">
          <ArrowRight class="w-5 h-5" />
        </div>

        <!-- To 카드 -->
        <div class="flex-1 bg-Gray-1 rounded-xl py-[1.6rem] px-[1rem] ml-2 text-center">
          <p class="pb-[0.6rem] Body02">{{ props.toCard.name }}</p>
          <p class="Body03 text-Gray-6 mb-[0.2rem]">
            충전 금액:
            <span class="text-Yellow-1">{{ props.toCard.chargedAmount.toLocaleString() }}원</span>
          </p>
          <p class="Body03 text-Gray-6 mb-[0.2rem]">
            인센티브(10%):
            <span class="text-Yellow-1">{{ props.toCard.incentiveAmount.toLocaleString() }}원</span>
          </p>
        </div>
      </div>

      <!-- 최종 금액 -->
      <div class="mb-[2rem] text-center Head02">
        최종 환전 금액:
        <span class="text-Black-2">{{ props.totalAmount.toLocaleString() }}원</span>
      </div>

      <!-- 버튼 -->
      <div class="flex gap-4">
        <button
          class="flex-1 py-3 border rounded-lg text-Gray-6 text-lg bg-White-1 hover:bg-Gray-1"
          @click="emit('close')"
        >
          취소
        </button>
        <button
          class="flex-1 py-3 rounded-lg bg-Brown-4 text-white text-lg hover:bg-Brown-5"
          @click="emit('confirm')"
        >
          환전
        </button>
      </div>
    </div>
  </div>
</template>
