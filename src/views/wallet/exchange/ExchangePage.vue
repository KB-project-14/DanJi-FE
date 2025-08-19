<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { CircleAlert } from 'lucide-vue-next'

import Layout from '@/components/layout/Layout.vue'
import ExchangeTabs from '@/components/wallet/exchange/ExchangeTab.vue'
import ExchangeCard from '@/components/wallet/exchange/ExchageCard.vue'
import ExchangeCash from '@/components/wallet/exchange/ExchangeCash.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import ExchangeCardConfirmModal from '@/components/wallet/modal/ExchangeCardConfirmModal.vue'
import ExchangCashConfirmModal from '@/components/wallet/modal/ExchangCashConfirmModal.vue'
import { calculateExchangeRegionToRegion, calculateExchangeRegionToCash } from '@/utils/exchange'
import useGetWalletList from '@/composables/queries/wallet/useGetWalletList'
import { useGetWalletTransaction } from '@/composables/queries/wallet/useGetWalletTransaction'
import type { BenefitType } from '@/types/local/localTypes'
import type {
  TransactionType,
  TransferRequestDTO,
  WalletTransactionParams,
} from '@/types/transaction/TransactionType'
import { TRANSACTION_TYPE } from '@/constants/Transaction'
import usePostTransfer from '@/composables/queries/transaction/usePostTransfer'
import router from '@/router'

const route = useRoute()
const cardId = route.params.id as string

// 카드 리스트
const cardList = useGetWalletList('LOCAL')
const cashWallets = useGetWalletList('CASH')

// 선택된 카드
const selectedCard = computed(() => cardList.value.find((c) => c.walletId === cardId) || null)
const CASH_WALLET_ID = computed(() => cashWallets.value?.[0]?.walletId || '')

// 이번 달 1일 ~ 오늘 날짜
const today = new Date()
const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
const params: WalletTransactionParams = {
  startDate: format(thisMonthStart, 'yyyy-MM-dd'),
  lastDate: format(today, 'yyyy-MM-dd'),
  direction: undefined,
  sortOrder: 'DESC',
}

// 거래내역 불러오기
const { data: transactionSummary } = useGetWalletTransaction(
  cardId,
  params,
  computed(() => !!selectedCard.value),
)

// 인센티브 및 충전 금액
const chargedAmountThisMonth = computed(() => transactionSummary.value?.aggregateCharge ?? 0)
const incentiveAmount = computed(() => transactionSummary.value?.aggregateIncentive ?? 0)

// 탭 및 입력값 등
const { mutate } = usePostTransfer()
const activeTab = ref(0)
const tabs = ['지역 → 지역', '지역 → 현금']
const handleTabChange = (index: number) => (activeTab.value = index)

const exchangeInput = ref<number | null>(null)
const selectedToCard = ref('')
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

const isButtonEnabled = computed(() => {
  if (!exchangeInput.value || exchangeInput.value <= 0) return false
  if (exchangeInput.value > (selectedCard.value?.balance || 0)) return false
  if (activeTab.value === 0 && !selectedToCard.value) return false
  return true
})

const showModal = ref(false)
const openModal = () => {
  if (isButtonEnabled.value) showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}

const postExchange = (cost: number, toWalletId: string, type: TransactionType) => {
  const requestBody: TransferRequestDTO = {
    amount: cost,
    fromWalletId: cardId,
    toWalletId,
    transactionLogging: true,
    type,
  }

  mutate(requestBody, {
    onSuccess: () => router.push({ name: 'ExchangeCompletePage', query: { success: 'true' } }),
    onError: () => router.push({ name: 'ExchangeCompletePage', query: { success: 'false' } }),
  })
}

const confirmExchange = (isConvert: boolean) => {
  showModal.value = false
  const toWalletId = isConvert ? selectedToCardData.value.walletId : CASH_WALLET_ID.value
  const type = isConvert ? TRANSACTION_TYPE.CONVERT : TRANSACTION_TYPE.REFUND
  postExchange(exchangeInput.value || 0, toWalletId, type)
}
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="activeTab == 0 ? '환전하기' : '환불하기'"
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
            :style="activeTab !== 0 ? 'margin-top: 1.4rem;' : ''"
          >
            <template v-if="activeTab === 0">
              <CircleAlert class="w-[1.2rem] h-[1.2rem]" />
              <span>환전 시 수수료 1%가 부과됩니다.</span>
            </template>
          </div>

          <div class="flex-1 overflow-y-auto px-[1.8rem]">
            <!-- 지역 → 지역 -->
            <exchange-card
              v-if="activeTab === 0 && selectedCard"
              v-model="exchangeInput"
              mode="region"
              @select-card="(value) => (selectedToCard = value)"
              :balance="selectedCard.balance"
              :percentage="{
                fromCard: selectedCard.percentage,
                toCard: selectedToCardData.percentage,
              }"
              :chargedAmount="chargedAmountThisMonth"
              :incentiveAmount="incentiveAmount"
              :cardName="selectedCard.localCurrencyName"
              :fromCardName="selectedCard.localCurrencyName"
              :benefit-type="{
                fromCard: selectedCard.benefitType,
                toCard: selectedToCardData.benefitType,
              }"
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
              :from-card-benefit="selectedCard.benefitType"
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
              {{ activeTab == 0 ? '환전하기' : '환불하기' }}
            </danji-button>
          </div>

          <!-- 지역 → 지역 모달 -->
          <exchange-card-confirm-modal
            v-if="showModal && activeTab === 0 && selectedCard && exchangeResult"
            :from-card="{
              name: selectedCard.localCurrencyName,
              percentage: selectedCard.percentage,
              benefitType: selectedCard.benefitType,
            }"
            :to-card="{
              name: selectedToCardData.localCurrencyName,
              percentage: selectedToCardData.percentage,
              benefitType: selectedToCardData.benefitType,
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
              benefitType: selectedCard.benefitType,
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
