<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'

// 지역화폐 정보 - 추후 API 연동 예정
const cardInfo = ref({
  name: '동백전',
  balance: 1000,
  benefit: 10000,
  maximum: 500000,
  chargedThisMonth: 100000,
  benefit_type: '인센티브',
  percentage: 10,
})

// 충전할 금액
const amount = ref<number>(0)

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
  amount.value = parseInt(target.value.replace(/[^0-9]/g, ''), 10) || 0
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

// 수수료
const fee = computed(() => (amount.value ? amount.value * 0.01 : 0))

// 인센티브
const incentive = computed(() =>
  amount.value > 0 ? amount.value * (cardInfo.value.percentage / 100) : 0,
)

// 실제 결제 금액 (통합지갑에서 빠질 금액)
const actualCharge = computed(() => (amount.value ? amount.value + fee.value : 0))

// 충전 후 지역화폐 잔액
const localCurrencyAfterCharge = computed(() => {
  return cardInfo.value.balance + amount.value + incentive.value
})

// 현재 통합지갑 잔액 (200,000 가정)
const walletCurrentBalance = ref(200000) // API 값으로 교체 예정

// 충전 후 통합지갑 잔액
const walletAfterCharge = computed(() => {
  if (!amount.value) return walletCurrentBalance.value
  return walletCurrentBalance.value - amount.value - fee.value
})

// 버튼 활성화 여부
const isDisabled = computed(() => !amount.value || amount.value < 10000 || !isHundredUnit.value)

// 금액 버튼 클릭 시
const setAmount = (val: number) => {
  amount.value += val
}

// 충전하기 버튼 클릭 시
const handleCharge = () => {
  if (isDisabled.value) {
    if (!isHundredUnit.value) {
      alert('100원 단위로 입력해주세요.')
    } else if (!amount.value || amount.value < 10000) {
      alert('최소 10,000원 이상 입력해야 합니다.')
    }
    return
  }

  // 실패 조건: 충전 금액이 통합지갑 잔액보다 많을 때
  if (amount.value + fee.value > walletCurrentBalance.value) {
    alert('충전 금액과 수수료의 합이 통합지갑 잔액보다 많습니다.')
    return
  }

  // 성공 로직
  console.log('충전 성공', amount.value)

  // 지역화폐 잔액 업데이트
  cardInfo.value.balance += amount.value + incentive.value

  // 통합지갑 잔액 차감
  walletCurrentBalance.value -= amount.value + fee.value

  // 금액 입력 초기화
  amount.value = 0
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
      <!-- 전체 flex 레이아웃 -->
      <div class="flex flex-col h-full px-[1.6rem] py-[1.8rem] bg-Background">
        <!-- 상단 내용 영역 -->
        <div class="flex-1 overflow-y-auto">
          <!-- 충전 금액 섹션 -->
          <section class="mb-[1.8rem] rounded-xl border border-Gray-2 bg-white p-[1.6rem]">
            <h2 class="mb-[1.2rem] Head02">
              충전할 금액
              <span class="text-Gray-4 Body04">(최소 10,000원 이상 / 100원 단위 충전 가능)</span>
            </h2>

            <!-- 금액 버튼 -->
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
              <!-- 경고 문구 -->
              <p v-if="amount && !isHundredUnit" class="mt-[0.4rem] text-Red-0 Body04">
                100원 단위로 입력해주세요.
              </p>
            </div>

            <!-- 혜택 계산 -->
            <div class="space-y-[0.4rem] Body03 mt-[1.2rem]">
              <p>
                예상 수수료(1%):
                <span class="text-Yellow-0">{{ fee.toLocaleString() }}원</span>
              </p>
              <p>
                {{ cardInfo.name }} 인센티브({{ cardInfo.percentage }}%):
                <span class="text-Yellow-0">{{ incentive.toLocaleString() }}원</span>
              </p>
              <p>
                실제 결제될 금액:
                <span class="text-Red-0">{{ actualCharge.toLocaleString() }}원</span>
              </p>
            </div>
          </section>

          <!-- 충전 후 잔액 -->
          <section class="mb-[2rem] p-[1.6rem] rounded-xl border border-Gray-2 bg-White-1">
            <div class="pb-[0.8rem] Head02">
              <p class="pb-[0.8rem]">충전 후 지역화폐 잔액</p>
              <div class="p-[1rem] mb-[1.2rem] border border-Gray-2 rounded-lg Body02 text-right">
                {{ localCurrencyAfterCharge.toLocaleString() }}원
              </div>
            </div>

            <div class="space-y-[1.6rem] p-[1.3rem] rounded-xl Body03 bg-Gray-0">
              <!-- 현재 통합지갑 잔액 -->
              <p class="flex justify-between pb-[1.2rem] border-b border-Gray-7">
                <span>현재 통합지갑 잔액:</span>
                <span>{{ walletCurrentBalance.toLocaleString() }}원</span>
              </p>

              <!-- 충전 후 통합지갑 잔액 -->
              <p class="flex justify-between">
                <span>충전 후 통합지갑 잔액:</span>
                <span>{{ walletAfterCharge.toLocaleString() }}원</span>
              </p>

              <!-- 캐쉬백 안내 -->
              <p v-if="cardInfo.benefit_type === '캐쉬백'" class="text-Red-0 Body04">
                캐쉬백 {{ incentive.toLocaleString() }}원은 다음 달에 지급됩니다.
              </p>
            </div>
          </section>
        </div>

        <!-- 하단 버튼 -->
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
