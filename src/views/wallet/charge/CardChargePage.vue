<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'

const amount = ref<number | null>(null) // 충전 금액
const balance = ref(500000) // 현재 잔액

// 금액 포맷 (콤마 + 원)
const formattedAmount = computed(() => {
  return amount.value ? amount.value.toLocaleString() + '원' : ''
})

// 100원 단위 유효성 체크
const isHundredUnit = computed(() => {
  return amount.value !== null ? amount.value % 100 === 0 : true
})

// input 입력 시 숫자만 저장
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  amount.value = parseInt(target.value.replace(/[^0-9]/g, ''), 10) || null
}

// focus 시 숫자만 보여주기
const handleFocus = (e: Event) => {
  const target = e.target as HTMLInputElement
  target.value = amount.value ? amount.value.toString() : ''
}

// blur 시 포맷된 값 보여주기
const handleBlur = (e: Event) => {
  const target = e.target as HTMLInputElement
  target.value = formattedAmount.value
}

// 계산
const fee = computed(() => (amount.value ? amount.value * 0.01 : 0))
const incentive = computed(() => (amount.value ? amount.value * 0.1 : 0))
const total = computed(() => (amount.value ? amount.value - fee.value : 0))

// 충전 후 잔액
const afterBalance = computed(() => balance.value + (amount.value || 0))

// 버튼 활성화 여부
const isDisabled = computed(() => !amount.value || amount.value < 10000 || !isHundredUnit.value)

// 금액 버튼 클릭 시
const setAmount = (val: number) => {
  amount.value = val
}

// 저장하기(충전하기) 클릭 시
const handleCharge = () => {
  if (isDisabled.value) {
    if (!isHundredUnit.value) {
      alert('100원 단위로 입력해주세요.')
    } else if (!amount.value || amount.value < 10000) {
      alert('최소 10,000원 이상 입력해야 합니다.')
    }
    return
  }
  console.log('충전 실행', amount.value)
  // API 호출 or 다음 페이지 이동 로직
}
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="'충전하기'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="flex flex-col h-full px-[1.6rem] py-[2rem] bg-background">
        <!-- 상단 내용 영역 -->
        <div class="flex-1 overflow-y-auto">
          <!-- 충전 금액 섹션 -->
          <section class="mb-[2rem] rounded-xl border border-Gray-2 bg-white p-[1.6rem]">
            <h2 class="mb-[1.2rem] Head02">
              충전할 금액
              <span class="text-Gray-4 Body04"> (최소 10,000원 이상 / 100원 단위 충전 가능) </span>
            </h2>

            <!-- 5/10/20만원 버튼 -->
            <div class="flex gap-[0.8rem] mb-[1.2rem] Body03">
              <button
                class="flex-1 py-[1rem] rounded-lg border border-Gray-3"
                @click="setAmount(50000)"
              >
                5만원
              </button>
              <button
                class="flex-1 py-[1rem] rounded-lg border border-Gray-3"
                @click="setAmount(100000)"
              >
                10만원
              </button>
              <button
                class="flex-1 py-[1rem] rounded-lg border border-Gray-3"
                @click="setAmount(200000)"
              >
                20만원
              </button>
            </div>

            <!-- 금액 입력 -->
            <div>
              <input
                type="text"
                placeholder="충전할 금액을 입력해주세요."
                class="w-full py-[1rem] px-[1.2rem] mb-[0.4rem] border border-Gray-3 rounded-lg Body02 text-right"
                :value="formattedAmount"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
              />
              <!-- 충전 금액 경고 문구 -->
              <p v-if="amount && !isHundredUnit" class="mt-[0.4rem] text-Red-0 Body04">
                100원 단위로 입력해주세요.
              </p>
            </div>

            <!-- 혜택 계산  -->
            <div class="space-y-[0.4rem] Body03 mt-[1.2rem]">
              <p>
                예상 수수료(1%):
                <span class="text-Yellow-0">{{ fee.toLocaleString() }}원</span>
              </p>
              <p>
                인센티브(10%):
                <span class="text-Yellow-0">{{ incentive.toLocaleString() }}원</span>
              </p>
              <p>
                실제 결제될 금액:
                <span class="text-Red-0">{{ total.toLocaleString() }}원</span>
              </p>
            </div>
          </section>

          <!-- 통합 지갑에서 충전 -->
          <section class="mb-[2rem] p-[1.6rem] rounded-xl border border-Gray-2 bg-White-1">
            <h2 class="mb-[1rem] Head02">통합 지갑에서 충전</h2>

            <div class="p-[1rem] mb-[1.2rem] border border-Gray-2 rounded-lg Body02 text-right">
              {{ (amount || 0).toLocaleString() }}원
            </div>

            <div class="space-y-[0.4rem]">
              <p class="flex justify-between">
                <span>현재 잔액:</span>
                <span>{{ balance.toLocaleString() }}원</span>
              </p>
              <p class="flex justify-between">
                <span>충전 후 잔액:</span>
                <span>{{ afterBalance.toLocaleString() }}원</span>
              </p>
            </div>
          </section>
        </div>

        <!-- 충전 버튼  -->
        <div class="pt-[1rem]">
          <danji-button
            variant="large"
            class="w-full whitespace-nowrap text-center"
            :disabled="isDisabled"
            @click="handleCharge"
          >
            충전하기
          </danji-button>
        </div>
      </div>
    </template>
  </Layout>
</template>
