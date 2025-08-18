<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { HandCoins } from 'lucide-vue-next'
import type { BenefitType } from '@/types/local/localTypes'
import { benefitTypeTextMap } from '@/constants/BenefitMapper'
import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import { isIncentiveWallet } from '@/utils/checkIncentiveType'
import { calculateExchangeRegionToRegion } from '@/utils/exchange'

const currentMonthLabel = format(new Date(), 'M월')

const props = defineProps<{
  balance: number
  chargedAmount: number
  incentiveAmount: number
  percentage: { fromCard: number; toCard: number }
  cardName?: string
  modelValue: number | null
  mode?: 'region' | 'cash'
  fromCardName: string
  benefitType: { fromCard: BenefitType; toCard: BenefitType }
  toCardList: WalletResponseDtoType[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  (e: 'select-card', value: string): void
}>()

const selectedCard = ref('')

const handleInput = (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', value)
}

const handleSelect = () => {
  emit('select-card', selectedCard.value)
}

const selectedCardBenefit = computed(() => {
  const card = props.toCardList.find((c) => c.localCurrencyName === selectedCard.value)
  return card
    ? `${card.localCurrencyName} 혜택 : ${benefitTypeTextMap[props.benefitType.toCard]} ${card.percentage}%`
    : ''
})

const excludedIncentive = computed(() => {
  if (!props.modelValue || !props.percentage.toCard) return ' - '

  const fromCardPercentage = isIncentiveWallet(props.benefitType.fromCard)
    ? props.percentage.fromCard
    : 0

  const toCardPercentage = isIncentiveWallet(props.benefitType.toCard) ? props.percentage.toCard : 0

  const { finalAmount } = calculateExchangeRegionToRegion(
    fromCardPercentage,
    toCardPercentage,
    props.modelValue,
  )
  return finalAmount.toLocaleString()
})
</script>

<template>
  <div class="flex flex-col gap-3 p-[2rem] pb-[8rem] rounded-lg shadow-sm bg-White-1">
    <div>
      <p class="Body02 text-Gray-5">환전 가능한 금액</p>
      <div class="flex items-center gap-2">
        <HandCoins class="w-[1.6rem] h-[1.6rem]" />
        <p class="Head0 text-Black-2">{{ props.balance.toLocaleString() }}원</p>
      </div>
    </div>

    <div class="Body03 text-Gray-6">
      {{ currentMonthLabel }} 충전한 금액:
      <span class="Body02 text-Black-2">{{ props.chargedAmount.toLocaleString() }}원</span><br />
      {{ currentMonthLabel }} 받은 {{ benefitTypeTextMap[benefitType.fromCard] }}({{
        props.percentage.fromCard
      }}%):
      <span class="Body02 text-Black-2">{{ props.incentiveAmount.toLocaleString() }}원</span>
    </div>

    <div class="flex flex-col gap-3 mt-[1rem]">
      <div class="flex items-center gap-2">
        <div class="Head04 text-Black-2">{{ props.cardName }}</div>
        <div v-if="isIncentiveWallet(benefitType.fromCard)" class="Body04 text-Gray-5">
          인센티브는 제외하고 환전됩니다
        </div>
      </div>

      <input
        :value="props.modelValue"
        @input="handleInput"
        type="number"
        placeholder="환전할 금액을 입력해주세요"
        class="p-[1.6rem] border rounded text-Gray-6 text-right Body02"
      />

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
            v-for="card in toCardList.filter((c) => c.localCurrencyId !== props.fromCardName)"
            :key="card.localCurrencyId"
            :value="card.localCurrencyName"
          >
            {{ card.localCurrencyName }}
          </option>
        </select>

        <div class="Head04 text-Black-2">{{ excludedIncentive }}원</div>
      </div>

      <p v-if="props.mode === 'region' && selectedCard" class="text-Gray-6">
        {{ selectedCardBenefit }}
      </p>

      <p class="text-Yellow-1 Body03" :class="{ invisible: !props.modelValue }">
        <span class="line-through">예상 수수료(1%)</span>
        <span class="text-Red-1"> 수수료 면제 대상입니다!</span>
      </p>
    </div>
  </div>
</template>
