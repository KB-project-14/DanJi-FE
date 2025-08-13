<script setup lang="ts">
import { computed } from 'vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import { calculateExchangeRegionToRegion } from '@/utils/exchange'
import { isIncentiveWallet } from '@/utils/checkIncentiveType'

import { ArrowDown } from 'lucide-vue-next'
import type { BenefitType } from '@/types/local/localTypes'

const props = defineProps<{
  fromCard: { name: string; percentage: number; benefitType: BenefitType }
  toCard: { name: string; percentage: number; benefitType: BenefitType }
  totalAmount: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const fromCardPercentage = isIncentiveWallet(props.fromCard.benefitType)
  ? props.fromCard.percentage
  : 0

const toCardPercentage = isIncentiveWallet(props.toCard.benefitType) ? props.fromCard.percentage : 0

// 계산 결과 가져오기
const exchangeResult = computed(() =>
  calculateExchangeRegionToRegion(fromCardPercentage, toCardPercentage, props.totalAmount),
)

const exchangeCalculationDescription = computed(() => {
  const fromIsIncentive = isIncentiveWallet(props.fromCard.benefitType)
  const toIsIncentive = isIncentiveWallet(props.toCard.benefitType)

  if (fromIsIncentive && toIsIncentive) {
    return `환전 시 기존 카드 인센티브(${props.fromCard.percentage}%)는 제외되며, \n환전할 카드 인센티브(${props.toCard.percentage}%)가 새로 적용됩니다.`
  }
  if (fromIsIncentive && !toIsIncentive) {
    return `환전 시 기존 카드 인센티브(${props.fromCard.percentage}%)는 제외되며, \n환전할 카드의 혜택은 추후 결제 시 적용됩니다.`
  }
  if (!fromIsIncentive && toIsIncentive) {
    return `환전할 카드 인센티브(${props.toCard.percentage}%)가 새로 적용됩니다.`
  }
  return `환전할 카드의 혜택은 추후 결제 시 적용됩니다.`
})
</script>

<template>
  <div class="fixed flex items-center justify-center inset-0 bg-Black-0 bg-opacity-50 z-50">
    <div class="p-[2rem] w-[85%] max-w-[350px] shadow-lg bg-White-1 rounded-2xl">
      <h2 class="pb-[2.4rem] Head02 text-center">최종 환전 금액 확인</h2>

      <div class="flex flex-col items-center mb-[2rem]">
        <!-- From -->
        <div class="w-full rounded-xl py-[1.6rem] px-[1rem] bg-Gray-1 text-center mb-[1rem]">
          <p class="pb-[0.6rem] Body02">{{ props.fromCard.name }}</p>
          <p class="Body03 text-Gray-6 mt-[1rem]">
            환전 예정 금액:
            <span class="text-Yellow-1">{{ props.totalAmount.toLocaleString() }}원</span>
          </p>
        </div>

        <div class="flex items-center justify-center text-Gray-4 w-[1.6rem] h-[1.6rem] mb-[1rem]">
          <ArrowDown />
        </div>

        <!-- To -->
        <div class="w-full bg-Gray-1 rounded-xl py-[1.6rem] px-[1rem] text-center">
          <p class="pb-[0.6rem] Body02">{{ props.toCard.name }}</p>
          <p class="Body03 text-Gray-6 mb-[0.2rem]">
            충전 금액:
            <span class="text-Yellow-1">{{ exchangeResult.baseAmount.toLocaleString() }}원</span>
          </p>
          <p v-if="isIncentiveWallet(toCard.benefitType)" class="Body03 text-Gray-6 mb-[0.2rem]">
            인센티브:
            <span class="text-Yellow-1">{{ exchangeResult.incentive.toLocaleString() }}원</span>
          </p>
        </div>
      </div>

      <div class="mb-[2rem] text-center Head02">
        최종 환전 금액:
        <span class="text-Black-2">{{ exchangeResult.finalAmount.toLocaleString() }}원</span>
      </div>
      <div class="mb-[1rem] text-center text-Gray-5 Body03 whitespace-pre-line">
        ※ {{ exchangeCalculationDescription }}
      </div>

      <div class="w-full max-w-[34.3rem] flex gap-3">
        <danji-button
          class="!px-[0.5rem] !py-[0.4rem] flex-1 h-[5rem] whitespace-nowrap text-center"
          variant="smallOutline"
          @click="emit('close')"
        >
          취소
        </danji-button>

        <danji-button
          class="!px-[0.5rem] !py-[0.5rem] flex-1 h-[5rem] whitespace-nowrap text-center"
          variant="small"
          @click="emit('confirm')"
        >
          환전
        </danji-button>
      </div>
    </div>
  </div>
</template>
