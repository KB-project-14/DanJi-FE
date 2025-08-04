<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { format, startOfMonth, endOfMonth } from 'date-fns'

import Layout from '@/components/layout/Layout.vue'
import CardHistoryItemList from '@/components/common/history/CardHistoryItemList.vue'
import Tooltip from '@/components/common/tooltip/Tooltip.vue'

import useGetWalletList from '@/composables/queries/wallet/getWalletList'
import { useGetWalletTransaction } from '@/composables/queries/wallet/getWalletTransaction'

// 라우트에서 카드 ID
const route = useRoute()
const cardId = route.params.id as string

// 카드 정보 가져오기
const localWallets = useGetWalletList('LOCAL')
const cardInfo = computed(() => (localWallets.value ?? []).find((c) => c.walletId === cardId))

// 날짜 기본값 (이번달 1일~오늘)
const currentMonthDate = ref(new Date())
const startDate = format(startOfMonth(currentMonthDate.value), 'yyyy-MM-dd')
const lastDate = format(endOfMonth(currentMonthDate.value), 'yyyy-MM-dd')

// 거래내역 API 호출
const transactionsData = useGetWalletTransaction(cardId, {
  startDate,
  lastDate,
  direction: undefined, // 전체 조회
  sortOrder: 'DESC',
})

// 거래내역 + 집계값 computed
const transactions = computed(() => transactionsData.value?.transactions ?? [])
const aggregateCharge = computed(() => transactionsData.value?.aggregateCharge ?? 0)
const aggregateIncentive = computed(() => transactionsData.value?.aggregateIncentive ?? 0)

// 충전 가능 금액 (maximum - aggregateCharge)
const availableAmount = computed(() => {
  const max = cardInfo.value?.maximum ?? 0
  return max - aggregateCharge.value
})

// 기간 라벨 (이번달 / 직접설정)
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
    :header-title="cardInfo?.localCurrencyName || '카드 상세'"
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
              <p class="Body00 text-Black-2">{{ cardInfo?.localCurrencyName }}</p>
              <tooltip
                position="top"
                align="start"
                :message="`이번달 ${cardInfo?.localCurrencyName}의 ${cardInfo?.benefitType}은 ${cardInfo?.percentage}% 입니다.`"
              />
            </div>
            <!-- 잔액 -->
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
      <card-history-item-list :histories="transactions" @month-change="handleMonthChange" />
    </template>
  </Layout>
</template>
