<script setup lang="ts">
import { computed, ref } from 'vue'
import { format } from 'date-fns'

import { useRoute } from 'vue-router'
import { startOfMonth, endOfMonth } from 'date-fns'

import Layout from '@/components/layout/Layout.vue'
import CardHistoryItemList from '@/components/common/history/CardHistoryItemList.vue'
import Tooltip from '@/components/common/tooltip/Tooltip.vue'

// 라우트에서 카드 ID
const route = useRoute()
const cardId = Number(route.params.id)

// 현재 선택된 월 (자식에서 emit으로 업데이트됨)
const currentMonthDate = ref(new Date())

// 카드 데이터 (API 연동 예정)
const allCards = [
  {
    id: 1,
    name: '동백전',
    balance: 32000,
    benefit: 10000, // 혜택 금액
    maximum: 500000, // 최대 한도
    benefit_type: '캐시백',
    percentage: 10,
  },
  {
    id: 2,
    name: '서울Pay',
    balance: 15000,
    benefit: 5000,
    maximum: 500000,
    benefit_type: '캐시백',
    percentage: 5,
  },
  {
    id: 3,
    name: '강원상품권',
    balance: 25000,
    benefit: 7000,
    maximum: 500000,
    benefit_type: '인센티브',
    percentage: 7,
  },
]

// 카드 정보
const cardInfo = computed(() => allCards.find((c) => c.id === cardId))

// 거래 내역 더미 데이터
interface HistoryItem {
  comment: string
  amount: number
  afterBalance: number
  direction: 'INCOME' | 'EXPENSE'
  type: 'CHARGE' | 'REFUND' | 'CONVERT' | 'PAYMENT'
  createdAt: string
}

const transaction: HistoryItem[] = [
  {
    comment: '샤브온당',
    amount: 10000,
    afterBalance: 91000,
    direction: 'EXPENSE',
    type: 'PAYMENT',
    createdAt: '2025-07-20T10:30:40',
  },
  {
    comment: '단지',
    amount: 500000,
    afterBalance: 501000,
    direction: 'INCOME',
    type: 'CHARGE',
    createdAt: '2025-07-18T10:20:40',
  },
  {
    comment: '단지카페',
    amount: 100000,
    afterBalance: 501000,
    direction: 'EXPENSE',
    type: 'PAYMENT',
    createdAt: '2025-04-18T10:20:40',
  },
  {
    comment: '충전',
    amount: 10000,
    afterBalance: 1000,
    direction: 'INCOME',
    type: 'CHARGE',
    createdAt: '2025-07-30T10:20:40',
  },
  {
    comment: '충전',
    amount: 10000,
    afterBalance: 100000,
    direction: 'INCOME',
    type: 'CHARGE',
    createdAt: '2025-04-30T10:20:40',
  },
]

// 박스 데이터 계산
const chargedAmount = computed(() => {
  const start = startOfMonth(currentMonthDate.value).getTime()
  const end = endOfMonth(currentMonthDate.value).getTime()

  return transaction
    .filter(
      (h) =>
        h.type === 'CHARGE' &&
        new Date(h.createdAt).getTime() >= start &&
        new Date(h.createdAt).getTime() <= end,
    )
    .reduce((sum, h) => sum + h.amount, 0)
})

const availableAmount = computed(() =>
  cardInfo.value ? cardInfo.value.maximum - chargedAmount.value : 0,
)

const selectedPeriod = ref('이번달')
const selectedStartDate = ref<Date | null>(null)
const selectedEndDate = ref<Date | null>(null)

const handleMonthChange = (payload: {
  date: Date
  period: string
  startDate: Date | null
  endDate: Date | null
}) => {
  currentMonthDate.value = payload.date
  selectedPeriod.value = payload.period
  selectedStartDate.value = payload.startDate
  selectedEndDate.value = payload.endDate
}

// 금액 안내 박스 문구 설정
const boxLabel = computed(() => {
  if (selectedPeriod.value === '직접 설정' && selectedStartDate.value && selectedEndDate.value) {
    return '설정기간에'
  }
  return `${currentMonthDate.value.getMonth() + 1}월`
})
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="cardInfo?.name || '카드 상세'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <!-- 카드 잔액 / 혜택 -->
      <div class="p-[3rem]">
        <div class="flex justify-between items-center mb-[2rem]">
          <div>
            <!-- 카드명 + 툴팁 -->
            <div class="flex items-center gap-2 relative">
              <p class="Body00 text-Black-2">{{ cardInfo?.name }}</p>
              <tooltip
                position="top"
                align="start"
                :message="`이번달 ${cardInfo?.name}의 ${cardInfo?.benefit_type}은 ${cardInfo?.percentage}% 입니다.`"
              />
            </div>
            <!-- 잔액 -->
            <p class="Head0 text-Black-2">{{ cardInfo?.balance.toLocaleString() }} 원</p>
            <div class="flex items-center gap-2 relative">
              <p class="Body04 text-Gray-5">충전 최대 한도 :</p>
              <p class="Body01">{{ cardInfo?.maximum.toLocaleString() }}원</p>
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
            <span>{{ chargedAmount.toLocaleString() }}원</span>
          </div>
          <div class="flex justify-between mb-[1.2rem] text-Gray-7">
            <span>{{ boxLabel }} 받은 혜택:</span>
            <span class="text-Blue-0">{{ cardInfo?.benefit.toLocaleString() }}원</span>
          </div>
          <div class="flex justify-between text-Gray-7">
            <span>{{ boxLabel }} 충전 가능 금액:</span>
            <span>{{ availableAmount.toLocaleString() }}원</span>
          </div>
        </div>
      </div>

      <!-- 거래 내역 리스트 -->
      <card-history-item-list :histories="transaction" @month-change="handleMonthChange" />
    </template>
  </Layout>
</template>
