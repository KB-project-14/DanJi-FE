<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { calculateExchangeRegionToCash } from '@/utils/exchange'
import { HandCoins } from 'lucide-vue-next'

const currentMonthLabel = format(new Date(), 'M월')

const props = defineProps<{
  balance: number
  chargedAmount: number
  incentiveAmount: number
  cardName?: string
  modelValue: number | null
  percentage?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const handleInput = (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', value)
}
// 현금 환전 금액 계산
const excludedIncentive = computed(() => {
  if (!props.modelValue || !props.percentage) return 0
  const { finalAmount } = calculateExchangeRegionToCash(props.percentage, props.modelValue)
  return finalAmount
})
</script>

<template>
  <div class="flex flex-col gap-3 p-[2rem] pb-[9rem] rounded-lg shadow-sm bg-White-1">
    <!-- 환전 가능 금액 -->
    <div>
      <p class="Body02 text-Gray-5">환전 가능한 금액</p>
      <div class="flex items-center gap-2">
        <HandCoins class="w-[1.6rem] h-[1.6rem]" />
        <p class="Head0 text-Black-2">{{ props.balance.toLocaleString() }}원</p>
      </div>
    </div>

    <!-- 내가 충전한 금액 / 인센티브 -->
    <div class="Body03 text-Gray-6">
      {{ currentMonthLabel }} 충전한 금액:
      <span class="Body02 text-Black-2">{{ props.chargedAmount.toLocaleString() }}원</span><br />
      {{ currentMonthLabel }} 받은 인센티브({{ props.percentage }}%):
      <span class="Body02 text-Black-2">{{ props.incentiveAmount.toLocaleString() }}원</span>
    </div>

    <!-- 입력 UI -->
    <div class="flex flex-col gap-3 mt-[1rem]">
      <div class="flex items-center gap-2">
        <div class="Head04 text-Black-2">{{ props.cardName }}</div>
        <div class="Body04 text-Gray-5">인센티브 비율만큼 차감된 금액으로 환전됩니다</div>
      </div>

      <input
        :value="props.modelValue"
        @input="handleInput"
        type="number"
        placeholder="환전할 금액을 입력해주세요"
        class="p-[1.6rem] border rounded text-Gray-6 text-right Body02"
      />

      <div class="flex items-center justify-between p-[1.6rem] border rounded">
        <div class="pl-[0.4rem] text-Gray-6 Body04">통합지갑</div>
        <div class="Head04 text-Black-2">{{ excludedIncentive.toLocaleString() }}원</div>
      </div>

      <p class="mt-1 text-Yellow-1 Body03" :class="{ invisible: !props.modelValue }">
        <span class="line-through">예상 수수료(1%)</span>
        <span class="text-Red-0"> 수수료 면제 대상입니다!</span>
      </p>
    </div>
  </div>
</template>
