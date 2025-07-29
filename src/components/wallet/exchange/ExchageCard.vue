<script setup lang="ts">
import { ref, computed } from 'vue'
import { HandCoins } from 'lucide-vue-next'

// props로 거래 내역과 카드 정보 받기
const props = defineProps<{
  balance: number
  percentage: number // 인센티브 비율
  transactions: { type: string; amount: number; date: string }[]
  cardName?: string
  modelValue: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  (e: 'select-card', value: string): void
}>()

// 이번 달 충전 금액 계산
const chargedAmountThisMonth = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  return props.transactions
    .filter((t) => t.type === 'charge' && new Date(t.date).getMonth() + 1 === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0)
})

// 인센티브 금액 계산
const incentiveAmount = computed(() =>
  Math.floor(chargedAmountThisMonth.value * (props.percentage / 100)),
)

const sortedCards = computed(() =>
  [
    { id: 1, name: '동백전', order: 3 },
    { id: 2, name: '서울Pay', order: 1 },
    { id: 3, name: '강원상품권', order: 2 },
    { id: 4, name: '부산Pay', order: 4 },
  ].sort((a, b) => a.order - b.order),
)

const selectedCard = ref('')

const handleInput = (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', value)
}

const handleSelect = () => {
  emit('select-card', selectedCard.value)
}
</script>

<template>
  <div class="flex flex-col gap-3 p-[2rem] pb-[9rem] rounded-lg shadow-sm bg-White-1">
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
      <span class="text-Yellow-1">{{ chargedAmountThisMonth.toLocaleString() }}원</span><br />
      내가 받은 인센티브({{ props.percentage }}%):
      <span class="text-Yellow-1">{{ incentiveAmount.toLocaleString() }}원</span>
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

      <div class="flex items-center justify-between border rounded p-[1.6rem]">
        <select
          v-model="selectedCard"
          @change="handleSelect"
          class="bg-transparent outline-none text-Gray-6 Body04"
        >
          <option value="">카드 선택</option>
          <option v-for="card in sortedCards" :key="card.id" :value="card.name">
            {{ card.name }}
          </option>
        </select>

        <div class="Head04 text-Black-2">
          {{ props.modelValue ? props.modelValue.toLocaleString() + '원' : '0원' }}
        </div>
      </div>

      <p class="mt-1 text-Yellow-1 Body03" :class="{ invisible: !props.modelValue }">
        <span class="line-through">예상 수수료(1%): 3,000원</span>
        <span class="text-Red-0"> 수수료 면제 대상입니다!</span>
      </p>
    </div>
  </div>
</template>
