<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import usePostTransfer from '@/composables/queries/transaction/usePostTransfer'
import type { TransferRequestDTO } from '@/types/transaction/TransactionType'
import { TRANSACTION_TYPE } from '@/constants/Transaction'
import useGetWallet from '@/composables/queries/wallet/useGetWallet'
import { benefitTypeTextMap } from '@/utils/benefit'

const router = useRouter()
const route = useRoute()

const { mutate } = usePostTransfer()
const routeWalletId = route.params.id as string
const CASH_WALLET_ID = '7333408f-212c-4c88-9089-2cf8b818456a'
const cashWalletInfo = useGetWallet(CASH_WALLET_ID)
const localWalletInfo = useGetWallet(routeWalletId)

const postCharge = (cost: number) => {
  const requestBody: TransferRequestDTO = {
    amount: cost,
    fromWalletId: CASH_WALLET_ID,
    toWalletId: routeWalletId,
    transactionLogging: true,
    type: TRANSACTION_TYPE.CHARGE,
  }

  mutate(requestBody)
}

// 충전할 금액
const amount = ref<number>(0)

// 금액 포맷 (콤마 + 원)
const formattedAmount = computed(() => {
  return amount.value ? amount.value.toLocaleString() + '원' : ''
})

// input 입력 시 숫자만 저장
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const numericValue = target.value.replace(/[^0-9]/g, '')
  amount.value = numericValue ? parseInt(numericValue, 10) : 0
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
  amount.value > 0 ? amount.value * (localWalletInfo.value.percentage / 100) : 0,
)

// 실제 결제 금액 (통합지갑에서 빠질 금액)
const actualCharge = computed(() => (amount.value ? Math.floor(amount.value + fee.value) : 0))

// 충전 후 지역화폐 잔액
const localCurrencyAfterCharge = computed(() => {
  return localWalletInfo.value.balance + amount.value + incentive.value
})

// 현재 통합지갑 잔액
const walletCurrentBalance = ref(cashWalletInfo.value.balance)

// 충전 후 통합지갑 잔액
const walletAfterCharge = computed(() => {
  if (!amount.value) return walletCurrentBalance.value
  return walletCurrentBalance.value - amount.value - fee.value
})

// 버튼 활성화 여부
const isDisabled = computed(() => !amount.value || !validateChargeAmount())

// 금액 버튼 클릭 시
const setAmount = (val: number) => {
  amount.value += val
}

// 유효성 검증 (월 충전 최대 금액을 초과 여부)
const validateChargeAmount = () => {
  const isChargeLimitValid = actualCharge.value <= (localWalletInfo.value.maximum ?? 0)
  return isChargeLimitValid
}

// 충전 처리 로직
const processCharge = () => {
  const isCashWalletBalanceValid = actualCharge.value <= walletCurrentBalance.value

  // 통합지갑 잔액 부족 시
  if (!isCashWalletBalanceValid) {
    return { success: false }
  }

  postCharge(amount.value + incentive.value)

  return { success: true }
}

const handleCharge = () => {
  // 충전 처리
  const result = processCharge()

  router.push({
    name: 'ChargeCompletePage',
    query: { success: result.success ? 'true' : 'false' },
  })
}
</script>

<template>
  <layout
    :header-type="'basic'"
    :header-title="'충전하기'"
    :show-right-icon="true"
    :is-bottom-nav="false"
    @right-click="router.push('/home')"
  >
    <template #content>
      <!-- 전체 flex 레이아웃 -->
      <div class="flex flex-col h-full px-[1.6rem] py-[1.6rem] bg-Background">
        <!-- 상단 내용 영역 -->
        <div class="flex-1 overflow-y-auto">
          <!-- 충전 금액 섹션 -->
          <section class="mb-[1.8rem] rounded-xl border border-Gray-2 bg-white p-[1.6rem]">
            <h2 class="mb-[1.2rem] Head02">충전할 금액</h2>

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
              <p v-if="!validateChargeAmount()" class="mt-[0.4rem] text-Red-0 Body04">
                지역화폐 월 충전 최대 한도를 초과했습니다.
              </p>
            </div>

            <!-- 혜택 계산 -->
            <div class="space-y-[0.4rem] mt-[1.2rem] Body03">
              <p>
                예상 수수료(1%):
                <span class="text-Yellow-0">{{ fee.toLocaleString() }}원</span>
              </p>
              <p v-if="benefitTypeTextMap[localWalletInfo.benefitType] === '인센티브'">
                {{ localWalletInfo.localCurrencyName }}
                인센티브({{ localWalletInfo.percentage }}%):
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
              <p
                v-if="benefitTypeTextMap[localWalletInfo.benefitType] === '캐시백'"
                class="text-Red-0 Body04"
              >
                캐시백 {{ incentive.toLocaleString() }}원은 다음 달에 지급됩니다.
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
  </layout>
</template>
