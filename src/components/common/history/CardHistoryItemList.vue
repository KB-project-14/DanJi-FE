<script setup lang="ts">
import { ref, computed } from 'vue'
import { startOfMonth, endOfMonth, subMonths, addMonths, format, isWithinInterval } from 'date-fns'
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-vue-next'

import CardHistoryItem from './CardHistoryItem.vue'
import TransactionFilterModal from '../modal/TransactionFilterModal.vue'

// 필터링 더미데이터 (추후 API 연동 예정)
const props = defineProps<{
  histories: {
    comment: string
    amount: number
    afterBalance: number
    direction: 'INCOME' | 'EXPENSE'
    type: 'CHARGE' | 'REFUND' | 'CONVERT' | 'PAYMENT'
    createdAt: string
  }[]
}>()

// 월 이동  (초기값 = 현재 달)
const currentMonthDate = ref(new Date())

// 월 이동 함수
const prevMonth = () => {
  currentMonthDate.value = subMonths(currentMonthDate.value, 1)
}
const nextMonth = () => {
  currentMonthDate.value = addMonths(currentMonthDate.value, 1)
}

// 표시용 월
const displayMonth = computed(() => format(currentMonthDate.value, 'M월'))

// 초기값 (추후 API 연동 예정)
const appliedFilter = ref<{
  period: string
  type: string
  order: string
  startDate: Date | null
  endDate: Date | null
}>({
  period: '이번달',
  type: '전체',
  order: '최신순',
  startDate: null,
  endDate: null,
})

const isFilterOpen = ref(false)
const openFilter = () => (isFilterOpen.value = true)
const closeFilter = () => (isFilterOpen.value = false)
const applyFilter = (filter: typeof appliedFilter.value) => {
  appliedFilter.value = filter

  // 이번달 → 오늘 기준
  if (filter.period === '이번달') {
    currentMonthDate.value = new Date()
  }
  // 지난달 → 오늘에서 한 달 전
  else if (filter.period === '지난달') {
    currentMonthDate.value = subMonths(new Date(), 1)
  }
}
const filteredHistories = computed(() => {
  let list = [...props.histories]

  if (
    appliedFilter.value.period === '직접 설정' &&
    appliedFilter.value.startDate &&
    appliedFilter.value.endDate
  ) {
    // 직접 설정일 때: startDate ~ endDate
    const start = appliedFilter.value.startDate.getTime()
    const end = appliedFilter.value.endDate.getTime()
    list = list.filter((h) => {
      const historyDate = new Date(h.createdAt).getTime()
      return historyDate >= start && historyDate <= end
    })
  } else {
    // 나머지(이번달/지난달 포함): currentMonthDate 기준
    const start = startOfMonth(currentMonthDate.value).getTime()
    const end = endOfMonth(currentMonthDate.value).getTime()
    list = list.filter((h) => {
      const historyDate = new Date(h.createdAt).getTime()
      return historyDate >= start && historyDate <= end
    })
  }

  // 거래 유형 필터
  if (appliedFilter.value.type === '입금만') {
    list = list.filter((h) => h.direction === 'INCOME')
  } else if (appliedFilter.value.type === '출금만') {
    list = list.filter((h) => h.direction === 'EXPENSE')
  }

  // 정렬
  list.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return appliedFilter.value.order === '최신순' ? dateB - dateA : dateA - dateB
  })

  return list
})
</script>
<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between bg-Gray-1 p-[1rem] pr-[1.4rem] pl-[1.4rem]">
      <!-- 월 이동 -->
      <div v-if="appliedFilter.period !== '직접 설정'" class="flex items-center gap-2">
        <button class="px-[0.2rem] text-Gray-5" @click="prevMonth"><ChevronLeft /></button>
        <span class="Body00">{{ displayMonth }}</span>
        <button class="px-[0.2rem] text-Gray-5" @click="nextMonth"><ChevronRight /></button>
      </div>

      <!-- 필터 버튼 -->
      <button class="flex items-center gap-1 Body02 text-Gray-5" @click="openFilter">
        <template
          v-if="
            appliedFilter.period === '직접 설정' && appliedFilter.startDate && appliedFilter.endDate
          "
        >
          {{ appliedFilter.startDate.toLocaleDateString() }} ~
          {{ appliedFilter.endDate.toLocaleDateString() }}
        </template>
        <template v-else>
          {{ appliedFilter.period }} · {{ appliedFilter.type }} · {{ appliedFilter.order }}
        </template>
        <ChevronDown class="w-[1.6rem] h-[1.6rem]" />
      </button>
    </div>

    <!-- 필터 모달 -->
    <transaction-filter-modal
      v-if="isFilterOpen"
      :initialFilter="appliedFilter"
      @close="closeFilter"
      @confirm="applyFilter"
    />

    <!-- 거래 내역 리스트 -->
    <div class="p-[1rem] pr-[1.4rem] pl-[1.4rem]">
      <template v-if="filteredHistories.length > 0">
        <card-history-item
          v-for="(history, index) in filteredHistories"
          :key="index"
          :comment="history.comment"
          :amount="history.amount"
          :afterBalance="history.afterBalance"
          :direction="history.direction"
          :type="history.type"
          :createdAt="history.createdAt"
        />
      </template>
      <template v-else>
        <div class="flex flex-col items-center justify-center py-8 text-Gray-5 Body02">
          <p>이용 내역이 없습니다.</p>
        </div>
      </template>
    </div>
  </div>
</template>
