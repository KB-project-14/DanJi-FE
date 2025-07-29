<script setup lang="ts">
import { ref } from 'vue'
import { HandCoins } from 'lucide-vue-next'

const props = defineProps<{
  balance: number
  chargedAmount: number
  incentiveAmount: number
  cardName?: string
}>()

const exchangeInput = ref<number | null>(null)
const selectedCard = ref('')
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
      내가 충전한 금액:
      <span class="text-Yellow-1">{{ props.chargedAmount.toLocaleString() }}원</span><br />
      내가 받은 인센티브(10%):
      <span class="text-Yellow-1">{{ props.incentiveAmount.toLocaleString() }}원</span>
    </div>

    <!-- 입력 UI -->
    <div class="flex flex-col gap-3 mt-[1rem]">
      <div class="flex items-center gap-2">
        <div class="Head04 text-Black-2">{{ props.cardName || '동백전' }}</div>
        <div class="Body04 text-Gray-5">최소 10,000원 이상 / 100원 단위 충전 가능</div>
      </div>

      <input
        v-model="exchangeInput"
        type="number"
        placeholder="환전할 금액을 입력해주세요"
        class="p-[1.6rem] border rounded text-Gray-6 text-right Body02"
      />

      <div class="flex items-center justify-between border rounded p-[1.6rem]">
        <!-- 통합지갑 고정 텍스트 -->
        <div class="pl-[0.4rem] text-Gray-6 Body04">통합지갑</div>

        <div class="Head04 text-Black-2">
          {{ exchangeInput ? exchangeInput.toLocaleString() + '원' : '0원' }}
        </div>
      </div>

      <p class="mt-1 text-Yellow-1 Body03" :class="{ invisible: !exchangeInput }">
        <span class="line-through">예상 수수료(1%): 3,000원</span>
        <span class="text-Red-0"> 수수료 면제 대상입니다!</span>
      </p>
    </div>
  </div>
</template>
