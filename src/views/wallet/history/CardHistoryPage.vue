<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { startOfMonth, format, addDays } from 'date-fns'

import Layout from '@/components/layout/Layout.vue'
import CardHistoryItemList from '@/components/common/history/CardHistoryItemList.vue'
import Tooltip from '@/components/common/tooltip/Tooltip.vue'

import useGetWalletList from '@/composables/queries/wallet/useGetWalletList'
import { useGetWalletTransaction } from '@/composables/queries/wallet/useGetWalletTransaction'
import type { FilterType } from '@/types/wallet/FilterType'
import type { WalletTransactionParams } from '@/types/transaction/TransactionType'

// 라우트에서 카드 ID
const route = useRoute()
const { walletId } = route.params as { walletId: string }

// 카드 정보
const localWallets = useGetWalletList('LOCAL')
const cardInfo = computed(() => (localWallets.value ?? []).find((c) => c.walletId === walletId))

// 필터 상태 (부모에서 관리)
const today = new Date()
const filter = ref<FilterType>({
  period: '이번달',
  type: '전체',
  order: '최신순',
  startDate: startOfMonth(today),
  endDate: today,
})

const queryParams = computed((): WalletTransactionParams => {
  const params: WalletTransactionParams = {
    sortOrder: filter.value.order === '최신순' ? 'DESC' : 'ASC',
  }

  if (filter.value.startDate) {
    params.startDate = format(filter.value.startDate, 'yyyy-MM-dd')
  }

  if (filter.value.endDate) {
    params.lastDate = format(addDays(filter.value.endDate, 1), 'yyyy-MM-dd')
  }

  if (filter.value.type === '입금만') params.direction = 'INCOME'
  else if (filter.value.type === '출금만') params.direction = 'EXPENSE'

  return params
})
// 서버 필터/정렬 결과를 그대로 사용 (프론트 재필터/재정렬 제거 →  1:1 일치)
const { data: transactionsData, isLoading } = useGetWalletTransaction(
  walletId,
  queryParams,
  computed(() => !!walletId),
)
const transactions = computed(() => transactionsData.value?.transactions ?? [])

// 집계(충전/혜택)도 서버 응답 그대로 사용
const aggregateCharge = computed(() => transactionsData.value?.aggregateCharge ?? 0)
const aggregateIncentive = computed(() => transactionsData.value?.aggregateIncentive ?? 0)

// 충전 가능 금액
const availableAmount = computed(() => {
  const max = cardInfo.value?.maximum ?? 0
  return Math.max(0, max - aggregateCharge.value)
})

// 라벨은 필터 기준으로 표시
const boxLabel = computed(() => `${(filter.value.startDate ?? today).getMonth() + 1}월`)

// 필터 업데이트 핸들러
const handleFilterUpdate = (newFilter: FilterType) => {
  filter.value = newFilter
}
</script>

<template>
  <Layout
    :header-type="'setting'"
    :header-title="cardInfo?.localCurrencyName || '카드 상세'"
    :is-bottom-nav="false"
    :show-left-icon="true"
    :show-right-icon="true"
  >
    <template #content>
      <div class="bg-White-1">
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
              class="relative w-[10rem] aspect-[1000/1586] rounded-xl border border-Gray-2 bg-white overflow-hidden"
            >
              <img
                v-if="cardInfo?.backgroundImageUrl"
                :src="`https://danji.cloud${cardInfo.backgroundImageUrl}`"
                alt="카드 이미지"
                class="absolute top-1/2 left-1/2 object-cover transform -translate-x-1/2 -translate-y-1/2 rotate-90 scale-[1.58]"
              />
            </div>
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
        <card-history-item-list
          v-if="walletId"
          :walletId="walletId"
          :transactions="transactions"
          :filter="filter"
          :isLoading="isLoading"
          @update:filter="handleFilterUpdate"
        />
      </div>
    </template>
  </Layout>
</template>
