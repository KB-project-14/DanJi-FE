<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { CircleAlert } from 'lucide-vue-next'

import Layout from '@/components/layout/Layout.vue'
import ExchangeTabs from '@/components/wallet/exchange/ExchangeTab.vue'
import ExchangeCard from '@/components/wallet/exchange/ExchageCard.vue'
import ExchangeCash from '@/components/wallet/exchange/ExchangeCash.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import ExchangeCardConfirmModal from '@/components/wallet/modal/ExchangeCardConfirmModal.vue'
import ExchangCashConfirmModal from '@/components/wallet/modal/ExchangCashConfirmModal.vue'
import { calculateExchangeRegionToRegion, calculateExchangeRegionToCash } from '@/utils/exchange'
import useGetWalletList from '@/composables/queries/wallet/getWalletList'
import type { BenefitType } from '@/types/local/localTypes'
import type { TransferRequestDTO } from '@/types/transaction/TransactionType'
import { TRANSACTION_TYPE } from '@/constants/Transaction'
import usePostTransfer from '@/composables/queries/transaction/usePostTransfer'
import router from '@/router'
const route = useRoute()
const cardId = route.params.id as string
const CASH_WALLET_ID = '7333408f-212c-4c88-9089-2cf8b818456a'
const cardList = useGetWalletList('LOCAL')
const { mutate } = usePostTransfer()

const postExchange = (cost: number, toWalletId: string) => {
  const requestBody: TransferRequestDTO = {
    amount: cost,
    fromWalletId: cardId,
    toWalletId: toWalletId,
    transactionLogging: true,
    type: TRANSACTION_TYPE.CONVERT,
  }

  mutate(requestBody, {
    onSuccess: () => {
      router.push({
        name: 'ExchangeCompletePage',
        query: {
          success: 'true',
        },
      })
    },
    onError: () => {
      router.push({
        name: 'ExchangeCompletePage',
        query: {
          success: 'false',
        },
      })
    },
  })
}

// 더미 거래 데이터
const transactions = [
  { type: 'charge', amount: 100000, date: '2025-07-01' },
  { type: 'charge', amount: 10000, date: '2025-07-10' },
  { type: 'payment', amount: 2000, date: '2025-07-15' },
  { type: 'refund', amount: 1000, date: '2025-07-20' },
]

// 선택된 from 카드
const selectedCard = computed(() => cardList.value.find((c) => c.walletId === cardId) || null)

// 이번 달 충전 금액
const chargedAmountThisMonth = computed(() => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  return transactions
    .filter((t) => {
      const transactionDate = new Date(t.date)
      return (
        t.type === 'charge' &&
        transactionDate.getFullYear() === currentYear &&
        transactionDate.getMonth() + 1 === currentMonth
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)
})
// 인센티브 금액
const incentiveAmount = computed(() => {
  if (!selectedCard.value) return 0
  return Math.floor(chargedAmountThisMonth.value * (selectedCard.value.percentage / 100))
})

// 탭
const activeTab = ref(0)
const tabs = ['지역 → 지역', '지역 → 현금']
const handleTabChange = (index: number) => (activeTab.value = index)

// 환전 금액 입력값
const exchangeInput = ref<number | null>(null)

// 선택된 To 카드
const selectedToCard = ref('')

// To 카드 데이터
const selectedToCardData = computed(() => {
  return (
    cardList.value.find((c) => c.localCurrencyName === selectedToCard.value) || {
      localCurrencyName: '',
      balance: 0,
      percentage: 0,
      chargedAmount: 0,
      incentiveAmount: 0,
      transactions: [],
      benefitType: 'INCENTIVE' as BenefitType,
      walletId: '',
    }
  )
})

const exchangeResult = computed(() => {
  if (!selectedCard.value || !exchangeInput.value) return null

  if (activeTab.value === 0) {
    return calculateExchangeRegionToRegion(
      selectedCard.value.percentage,
      selectedToCardData.value.percentage,
      exchangeInput.value,
    )
  } else {
    return calculateExchangeRegionToCash(selectedCard.value.percentage, exchangeInput.value)
  }
})

// 버튼 활성화 여부
const isButtonEnabled = computed(() => {
  if (!exchangeInput.value || exchangeInput.value <= 0) return false
  if (exchangeInput.value > (selectedCard.value?.balance || 0)) return false
  if (activeTab.value === 0 && !selectedToCard.value) return false
  return true
})

// 모달 상태
const showModal = ref(false)
const openModal = () => {
  if (isButtonEnabled.value) showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}

const confirmExchange = (isConvert: boolean) => {
  console.log('환전 확정!', {
    amount: exchangeInput.value,
    from: selectedCard.value?.localCurrencyName,
    to: selectedToCard.value,
  })
  showModal.value = false

  if (isConvert) {
    postExchange(exchangeInput.value ?? 0, selectedToCardData.value.walletId)
  } else {
    postExchange(exchangeInput.value ?? 0, CASH_WALLET_ID)
  }
}
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="'환전하기'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="min-h-full flex flex-col justify-between bg-Background">
        <div class="min-h-full flex flex-col bg-Background">
          <!-- 탭 -->
          <div class="pr-[1.8rem] pl-[1.8rem] pt-[1rem]">
            <exchange-tabs :tabs="tabs" :activeIndex="activeTab" @change="handleTabChange" />
          </div>

          <div
            class="flex items-center justify-end pt-[1rem] pr-[2rem] pb-[1rem] gap-1 text-right text-Gray-7"
          >
            <CircleAlert class="w-[1.2rem] h-[1.2rem]" />
            <span>환전 시 수수료 1%가 부과됩니다.</span>
          </div>

          <div class="flex-1 overflow-y-auto px-[1.8rem]">
            <!-- 지역 → 지역 -->
            <exchange-card
              v-if="activeTab === 0 && selectedCard"
              v-model="exchangeInput"
              mode="region"
              @select-card="(value) => (selectedToCard = value)"
              :balance="selectedCard.balance"
              :percentage="selectedCard.percentage"
              :chargedAmount="chargedAmountThisMonth"
              :incentiveAmount="incentiveAmount"
              :cardName="selectedCard.localCurrencyName"
              :fromCardName="selectedCard.localCurrencyName"
              :benefit-type="selectedToCardData.benefitType"
              :to-card-list="cardList.filter((item) => item.walletId !== cardId)"
            />

            <!-- 지역 → 현금 -->
            <exchange-cash
              v-else-if="activeTab === 1 && selectedCard"
              v-model="exchangeInput"
              mode="cash"
              :balance="selectedCard.balance"
              :chargedAmount="chargedAmountThisMonth"
              :incentiveAmount="incentiveAmount"
              :cardName="selectedCard.localCurrencyName"
              :percentage="selectedCard.percentage"
            />
          </div>

          <!-- 버튼 -->
          <div class="p-[1.8rem] pt-[2rem]">
            <danji-button
              variant="large"
              class="w-full whitespace-nowrap text-center"
              :disabled="!isButtonEnabled"
              @click="openModal"
            >
              환전하기
            </danji-button>
          </div>

          <!-- 지역 → 지역 모달 -->
          <exchange-card-confirm-modal
            v-if="showModal && activeTab === 0 && selectedCard && exchangeResult"
            :from-card="{
              name: selectedCard.localCurrencyName,
              percentage: selectedCard.percentage,
            }"
            :to-card="{
              name: selectedToCardData.localCurrencyName,
              percentage: selectedToCardData.percentage,
            }"
            :total-amount="exchangeInput || 0"
            :result="exchangeResult"
            @close="closeModal"
            @confirm="confirmExchange(true)"
          />

          <!-- 지역 → 현금 모달 -->
          <exchang-cash-confirm-modal
            v-if="showModal && selectedCard && activeTab === 1 && exchangeResult"
            :from-card="{
              name: selectedCard.localCurrencyName,
              percentage: selectedCard.percentage,
            }"
            :total-amount="exchangeInput || 0"
            :result="exchangeResult"
            @close="closeModal"
            @confirm="confirmExchange(false)"
          />
        </div>
      </div>
    </template>
  </Layout>
</template>
