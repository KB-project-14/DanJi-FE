<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import usePostTransfer from '@/composables/queries/transaction/usePostTransfer'
import type { TransferRequestDTO } from '@/types/transaction/TransactionType'
import { TRANSACTION_TYPE } from '@/constants/Transaction'
import useGetWallet from '@/composables/queries/wallet/useGetWallet'
import { benefitTypeTextMap } from '@/constants/BenefitMapper'
import useGetWalletList from '@/composables/queries/wallet/useGetWalletList'

const router = useRouter()
const route = useRoute()

const { mutate } = usePostTransfer()
const routeWalletId = route.params.id as string
const cashWallets = useGetWalletList('CASH')
const CASH_WALLET_ID = computed(() => cashWallets.value?.[0]?.walletId || '').value
const cashWalletInfo = useGetWallet(CASH_WALLET_ID)
const localWalletInfo = useGetWallet(routeWalletId)

// 런칭 이벤트: 수수료 면제 (표시는 하되 계산/차감에는 반영 X)
const EVENT_FEE_FREE = true

// 충전할 금액
const amount = ref<number>(0)

// 금액 포맷 (콤마 + 원)
const formattedAmount = computed(() => (amount.value ? amount.value.toLocaleString() + '원' : ''))

// input 숫자만 저장
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const numericValue = target.value.replace(/[^0-9]/g, '')
  amount.value = numericValue ? parseInt(numericValue, 10) : 0
}

// focus/blur 시 표시 전환
const handleFocus = (e: Event) => {
  const target = e.target as HTMLInputElement
  target.value = amount.value ? amount.value.toString() : ''
}
const handleBlur = (e: Event) => {
  const target = e.target as HTMLInputElement
  target.value = formattedAmount.value
}

// 안전 기본값 (데이터 로딩 전 NaN/에러 방지)
const walletCurrentBalance = computed(() => cashWalletInfo.value?.balance ?? 0)
const localBalance = computed(() => localWalletInfo.value?.balance ?? 0)
const localPercentage = computed(() => localWalletInfo.value?.percentage ?? 0)

// 수수료 (표시용)
const fee = computed(() => (amount.value ? amount.value * 0.01 : 0))

// 인센티브 (표기 및 지역화폐 잔액 계산에만 사용)
const incentive = computed(() =>
  amount.value > 0 ? amount.value * (localPercentage.value / 100) : 0,
)

// 실제 결제 금액(통합지갑에서 빠질 금액) — 수수료 면제 시 수수료 없음
const actualCharge = computed(() => (EVENT_FEE_FREE ? amount.value : amount.value + fee.value))

// 최종 충전 금액 (인센 : 충전 금액 + 인센티브, 그 외 : 충전 금액만)
const finalChargeAmount = computed(() => {
  if (isIncentive()) {
    return amount.value + incentive.value
  } else {
    return amount.value
  }
})

// 충전 후 지역화폐 잔액 (인센 : 인센 포함 더한 금액, 그 외 : 충전 금액만 더함)
const localCurrencyAfterCharge = computed(() => {
  if (isIncentive()) {
    return localBalance.value + amount.value + incentive.value
  } else {
    return localBalance.value + amount.value
  }
})

// 충전 후 통합지갑 잔액 — 이벤트 중 수수료 미반영
const walletAfterCharge = computed(() => {
  if (!amount.value) return walletCurrentBalance.value
  return walletCurrentBalance.value - actualCharge.value
})

// 버튼 활성화 여부
const isDisabled = computed(() => !amount.value || walletAfterCharge.value < 0)

// 금액 버튼
const setAmount = (val: number) => {
  amount.value += val
}

// API 호출 래퍼
const postCharge = (cost: number): Promise<{ success: boolean }> => {
  const requestBody: TransferRequestDTO = {
    amount: cost,
    fromWalletId: CASH_WALLET_ID,
    toWalletId: routeWalletId,
    transactionLogging: true,
    type: TRANSACTION_TYPE.CHARGE,
  }
  return new Promise((resolve) => {
    mutate(requestBody, {
      onSuccess: () => resolve({ success: true }),
      onError: () => resolve({ success: false }),
    })
  })
}

// 충전 처리
const processCharge = () => {
  const isCashWalletBalanceValid = actualCharge.value <= walletCurrentBalance.value
  if (!isCashWalletBalanceValid) return { success: false }
  // 서버에는 '충전 금액' 그대로 전송 (수수료 없음)
  return postCharge(amount.value)
}

const handleCharge = async () => {
  const result = await processCharge()
  router.push({
    name: 'ChargeCompletePage',
    query: { success: result.success ? 'true' : 'false' },
  })
}

const isIncentive = () => benefitTypeTextMap[localWalletInfo.value.benefitType] === '인센티브'
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
            </div>

            <!-- 혜택 계산 -->
            <div class="space-y-[0.4rem] mt-[1.2rem] Body03">
              <p
                class="flex items-center gap-2 Body03 text-Yellow-1 transition-all duration-300"
                :class="{ 'border-t border-Gray-3 pt-[0.8rem] mt-[0.4rem]': amount }"
              >
                <span :class="{ 'line-through text-Black-2': amount, 'text-Yellow-0': !amount }">
                  예상 수수료(1%): {{ fee.toLocaleString() }}원
                </span>
                <span v-if="amount" class="text-Red-0">수수료 면제 대상입니다!</span>
              </p>
              <p v-if="isIncentive()">
                {{ localWalletInfo.localCurrencyName }}
                인센티브({{ localWalletInfo.percentage }}%):
                <span class="text-Yellow-0">{{ incentive.toLocaleString() }}원</span>
              </p>
              <p>
                최종 충전 금액:
                <span class="text-Red-1 Body02">{{ finalChargeAmount.toLocaleString() }}원</span>
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
              <p v-if="walletAfterCharge < 0" class="mt-[0.8rem] text-Red-0 text-right Body04">
                통합지갑 잔액이 부족하여 충전할 수 없습니다.
              </p>
              <!-- 캐쉬백 안내 -->
              <p v-if="!isIncentive()" class="text-Red-0 Body04">
                {{ benefitTypeTextMap[localWalletInfo.benefitType] }}
                {{ incentive.toLocaleString() }}원은 다음 달에 지급됩니다.
              </p>
            </div>
          </section>
        </div>

        <!-- 하단 버튼: 항상 하단 고정 -->
        <div class="sticky bottom-0 px-[1.6rem] pb-[1.6rem] bg-Background">
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
