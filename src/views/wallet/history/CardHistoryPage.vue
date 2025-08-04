<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { startOfMonth, endOfMonth, format } from 'date-fns'

import Layout from '@/components/layout/Layout.vue'
import CardHistoryItemList from '@/components/common/history/CardHistoryItemList.vue'
import Tooltip from '@/components/common/tooltip/Tooltip.vue'
import TransactionFilterModal from '@/components/common/modal/TransactionFilterModal.vue'

import useGetWalletList from '@/composables/queries/wallet/getWalletList'
import { useGetWalletTransaction } from '@/composables/queries/wallet/getWalletTransaction'
import type { FilterType } from '@/types/wallet/FilterType'

// 라우트에서 카드 ID
const route = useRoute()
const cardId = route.params.id as string

// 카드 정보
const localWallets = useGetWalletList('LOCAL')
const cardInfo = computed(() => (localWallets.value ?? []).find((c) => c.walletId === cardId))

// === 필터 상태 ===
const today = new Date()

const filter = ref<FilterType>({
  period: '이번달',
  type: '전체',
  order: '최신순',
  startDate: startOfMonth(today),
  endDate: endOfMonth(today),
})

// 모달 열림 상태
const showFilterModal = ref(false)
const openFilterModal = () => (showFilterModal.value = true)
const closeFilterModal = () => (showFilterModal.value = false)

// 필터 확인 시 업데이트
const handleFilterConfirm = (newFilter: FilterType) => {
  filter.value = newFilter
  closeFilterModal()
}

// === API 호출용 파라미터 ===
const startDate = computed(() =>
  format(filter.value.startDate ?? startOfMonth(today), 'yyyy-MM-dd'),
)
const lastDate = computed(() => format(filter.value.endDate ?? endOfMonth(today), 'yyyy-MM-dd'))

// 거래내역 API 호출
const transactionsData = useGetWalletTransaction(cardId, {
  startDate: startDate.value,
  lastDate: lastDate.value,
  direction:
    filter.value.type === '입금만'
      ? 'INCOME'
      : filter.value.type === '출금만'
        ? 'EXPENSE'
        : undefined,
  sortOrder: filter.value.order === '최신순' ? 'DESC' : 'ASC',
})

// 거래내역 + 집계값
const transactions = computed(() => transactionsData.value?.transactions ?? [])
const aggregateCharge = computed(() => transactionsData.value?.aggregateCharge ?? 0)
const aggregateIncentive = computed(() => transactionsData.value?.aggregateIncentive ?? 0)

// 충전 가능 금액
const availableAmount = computed(() => {
  const max = cardInfo.value?.maximum ?? 0
  return Math.max(0, max - aggregateCharge.value)
})

// 박스 라벨
const boxLabel = computed(() => {
  if (filter.value.period === '직접 설정' && filter.value.startDate && filter.value.endDate) {
    return '설정기간에'
  }
  return `${(filter.value.startDate?.getMonth() ?? today.getMonth()) + 1}월`
})
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="cardInfo?.localCurrencyName || '카드 상세'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <!-- 카드 잔액 / 혜택 -->
      <div class="p-[3rem]">
        <div class="flex justify-between items-center mb-[2rem]">
          <div>
            <div class="flex items-center gap-2 relative">
              <p class="Body00 text-Black-2">{{ cardInfo?.localCurrencyName }}</p>
              <tooltip
                position="top"
                align="start"
                :message="`이번달 ${cardInfo?.localCurrencyName}의 ${cardInfo?.benefitType}은 ${cardInfo?.percentage}% 입니다.`"
              />
            </div>
            <p class="Head0 text-Black-2">{{ cardInfo?.balance?.toLocaleString() }} 원</p>
            <div class="flex items-center gap-2 relative">
              <p class="Body04 text-Gray-5">충전 최대 한도 :</p>
              <p class="Body01">{{ cardInfo?.maximum?.toLocaleString() }}원</p>
            </div>
          </div>

          <div
            class="relative w-[10rem] aspect-[1000/1586] rounded-xl bg-cover bg-center border border-Gray-3"
            :style="{ backgroundImage: `url('/images/sample-card.png')` }"
          ></div>
        </div>

        <!-- 박스 -->
        <div class="bg-Gray-1 rounded-xl p-[1.4rem] Body00 text-Black-2">
          <div class="flex justify-between mb-[1.2rem] text-Gray-7">
            <span>{{ boxLabel }} 충전한 금액:</span>
            <span>{{ aggregateCharge.toLocaleString() }}원</span>
          </div>
          <div class="flex justify-between mb-[1.2rem] text-Gray-7">
            <span>{{ boxLabel }} 받은 혜택:</span>
            <span class="text-Blue-0">{{ aggregateIncentive.toLocaleString() }}원</span>
          </div>
          <div class="flex justify-between text-Gray-7">
            <span>{{ boxLabel }} 충전 가능 금액:</span>
            <span>{{ availableAmount.toLocaleString() }}원</span>
          </div>
        </div>
      </div>

      <!-- 거래 내역 리스트 -->
      <card-history-item-list :histories="transactions" />

      <!-- 필터 버튼 -->
      <button
        class="fixed bottom-[8rem] right-[2rem] bg-Blue-0 text-White-1 p-3 rounded-full shadow-md"
        @click="openFilterModal"
      >
        필터
      </button>

      <!-- 필터 모달 -->
      <transaction-filter-modal
        v-if="showFilterModal"
        :initial-filter="filter"
        @confirm="handleFilterConfirm"
        @close="closeFilterModal"
      />
    </template>
  </Layout>
</template>
