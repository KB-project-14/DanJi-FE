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
import { isIncentiveWallet } from '@/utils/checkIncentiveType'
import { useWalletStore } from '@/stores/useWalletStore'

const router = useRouter()
const route = useRoute()

const { mutate } = usePostTransfer()
const routeWalletId = route.params.id as string
const cashWalletInfo = useWalletStore().cashWallet
const localWalletInfo = useGetWallet(routeWalletId)

const EVENT_FEE_FREE = true
const amount = ref<number>(0)
const formattedAmount = computed(() => (amount.value ? amount.value.toLocaleString() + '원' : ''))

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const numericValue = target.value.replace(/[^0-9]/g, '')
  amount.value = numericValue ? parseInt(numericValue, 10) : 0
}

const handleFocus = (e: Event) => {
  const target = e.target as HTMLInputElement
  target.value = amount.value ? amount.value.toString() : ''
}
const handleBlur = (e: Event) => {
  const target = e.target as HTMLInputElement
  target.value = formattedAmount.value
}

const walletCurrentBalance = computed(() => cashWalletInfo?.balance ?? 0)
const localBalance = computed(() => localWalletInfo.value?.balance ?? 0)
const localPercentage = computed(() => localWalletInfo.value?.percentage ?? 0)
const fee = computed(() => (amount.value ? amount.value * 0.01 : 0))

const incentive = computed(() =>
  amount.value > 0 ? amount.value * (localPercentage.value / 100) : 0,
)

const actualCharge = computed(() => (EVENT_FEE_FREE ? amount.value : amount.value + fee.value))

const finalChargeAmount = computed(() => {
  if (isIncentiveWallet(localWalletInfo.value.benefitType)) {
    return amount.value + incentive.value
  } else {
    return amount.value
  }
})

const localCurrencyAfterCharge = computed(() => {
  if (isIncentiveWallet(localWalletInfo.value.benefitType)) {
    return localBalance.value + amount.value + incentive.value
  } else {
    return localBalance.value + amount.value
  }
})

const walletAfterCharge = computed(() => {
  if (!amount.value) return walletCurrentBalance.value
  return walletCurrentBalance.value - actualCharge.value
})

const isDisabled = computed(() => !amount.value || walletAfterCharge.value < 0)

const setAmount = (val: number) => {
  amount.value += val
}

const postCharge = (cost: number): Promise<{ success: boolean }> => {
  const requestBody: TransferRequestDTO = {
    amount: cost,
    fromWalletId: cashWalletInfo?.walletId ?? '',
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

const processCharge = () => {
  const isCashWalletBalanceValid = actualCharge.value <= walletCurrentBalance.value
  if (!isCashWalletBalanceValid) return { success: false }

  return postCharge(amount.value)
}

const handleCharge = async () => {
  const result = await processCharge()
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
      <div class="flex flex-col h-full px-[1.6rem] py-[1.6rem] bg-Background">
        <div class="flex-1 overflow-y-auto">
          <section class="mb-[1.8rem] rounded-xl border border-Gray-2 bg-white p-[1.6rem]">
            <h2 class="mb-[1.2rem] Head02">충전할 금액</h2>

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
              <p v-if="isIncentiveWallet(localWalletInfo.benefitType)">
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

          <section class="mb-[2rem] p-[1.6rem] rounded-xl border border-Gray-2 bg-White-1">
            <div class="pb-[0.8rem] Head02">
              <p class="pb-[0.8rem]">충전 후 지역화폐 잔액</p>
              <div class="p-[1rem] mb-[1.2rem] border border-Gray-2 rounded-lg Body02 text-right">
                {{ localCurrencyAfterCharge.toLocaleString() }}원
              </div>
            </div>

            <div class="space-y-[1.6rem] p-[1.3rem] rounded-xl Body03 bg-Gray-0">
              <p class="flex justify-between pb-[1.2rem] border-b border-Gray-7">
                <span>현재 통합지갑 잔액:</span>
                <span>{{ walletCurrentBalance.toLocaleString() }}원</span>
              </p>

              <p class="flex justify-between">
                <span>충전 후 통합지갑 잔액:</span>
                <span>{{ walletAfterCharge.toLocaleString() }}원</span>
              </p>
              <p v-if="walletAfterCharge < 0" class="mt-[0.8rem] text-Red-0 text-right Body04">
                통합지갑 잔액이 부족하여 충전할 수 없습니다.
              </p>

              <p v-if="!isIncentiveWallet(localWalletInfo.benefitType)" class="text-Red-0 Body04">
                {{ benefitTypeTextMap[localWalletInfo.benefitType] }}
                {{ incentive.toLocaleString() }}원은 다음 달에 지급됩니다.
              </p>
            </div>
          </section>
        </div>

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
