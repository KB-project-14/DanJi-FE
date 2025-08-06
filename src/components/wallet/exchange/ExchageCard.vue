<script setup lang="ts">
import { ref, computed } from 'vue'
import { HandCoins } from 'lucide-vue-next'
import type { BenefitType } from '@/types/local/localTypes'
import { benefitTypeTextMap } from '@/utils/benefit'

const props = defineProps<{
  balance: number
  chargedAmount: number
  incentiveAmount: number
  percentage: number
  cardName?: string
  modelValue: number | null
  mode?: 'region' | 'cash' // 지역→지역인지, 지역→현금인지 구분
  fromCardName: string
  benefitType: BenefitType
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  (e: 'select-card', value: string): void
}>()

// 카드 목록
const sortedCards = [
  { id: 1, name: '동백전', percentage: 7 },
  { id: 2, name: '서울Pay', percentage: 10 },
  { id: 3, name: '강원상품권', percentage: 10 },
  { id: 4, name: '부산Pay', percentage: 10 },
]

// To 카드 선택 (지역→지역 모드일 때만 사용)
const selectedCard = ref('')

// 금액 입력 처리
const handleInput = (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', value)
}

// 카드 선택 처리
const handleSelect = () => {
  emit('select-card', selectedCard.value)
}

// 혜택 문구 (지역→지역에서만 사용)
const selectedCardBenefit = computed(() => {
  const card = sortedCards.find((c) => c.name === selectedCard.value)
  return card
    ? `${card.name} 혜택 : ${benefitTypeTextMap[props.benefitType]} ${card.percentage}%`
    : ''
})
</script>

<template>
  <div class="flex flex-col gap-3 p-[2rem] pb-[8rem] rounded-lg shadow-sm bg-White-1">
    <!-- 환전 가능한 금액 -->
    <div>
      <p class="Body02 text-Gray-5">환전 가능한 금액</p>
      <div class="flex items-center gap-2">
        <HandCoins class="w-[1.6rem] h-[1.6rem]" />
        <p class="Head0 text-Black-2">{{ props.balance.toLocaleString() }}원</p>
      </div>
    </div>

    <!-- 내가 충전한 금액 / 인센티브 -->
    <div class="Body03 text-Gray-6">
      내가 충전한 금액:
      <span class="text-Yellow-1">{{ props.chargedAmount.toLocaleString() }}원</span><br />
      내가 받은 인센티브({{ props.percentage }}%):
      <span class="text-Yellow-1">{{ props.incentiveAmount.toLocaleString() }}원</span>
    </div>

    <!-- 입력 UI -->
    <div class="flex flex-col gap-3 mt-[1rem]">
      <div class="flex items-center gap-2">
        <div class="Head04 text-Black-2">{{ props.cardName }}</div>
        <div class="Body04 text-Gray-5">인센티브는 제외하고 환전됩니다</div>
      </div>

      <input
        :value="props.modelValue"
        @input="handleInput"
        type="number"
        placeholder="환전할 금액을 입력해주세요"
        class="p-[1.6rem] border rounded text-Gray-6 text-right Body02"
      />

      <!-- 지역→지역 모드일 때만 카드 선택 -->
      <div
        v-if="props.mode === 'region'"
        class="flex items-center justify-between border rounded p-[1.6rem]"
      >
        <select
          v-model="selectedCard"
          @change="handleSelect"
          class="bg-transparent outline-none text-Gray-6 Body04"
        >
          <option value="">카드 선택</option>
          <option
            v-for="card in sortedCards.filter((c) => c.name !== props.fromCardName)"
            :key="card.id"
            :value="card.name"
          >
            {{ card.name }}
          </option>
        </select>

        <div class="Head04 text-Black-2">
          {{ props.modelValue ? props.modelValue.toLocaleString() + '원' : '0원' }}
        </div>
      </div>

      <!-- 혜택 문구 -->
      <p v-if="props.mode === 'region' && selectedCard" class="text-Gray-6">
        {{ selectedCardBenefit }}
      </p>

      <p class="text-Yellow-1 Body03" :class="{ invisible: !props.modelValue }">
        <span class="line-through">예상 수수료(1%)</span>
        <span class="text-Red-0"> 수수료 면제 대상입니다!</span>
      </p>
    </div>
  </div>
</template>
