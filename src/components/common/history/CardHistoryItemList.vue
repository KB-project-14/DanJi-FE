<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { startOfMonth, endOfMonth, subMonths, addMonths, format } from 'date-fns'
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-vue-next'

import CardHistoryItem from './CardHistoryItem.vue'
import TransactionFilterModal from '../modal/TransactionFilterModal.vue'

const emit = defineEmits(['month-change'])

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

// 초기 필터 상태
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

// 월 이동
const currentMonthDate = ref(new Date())

// 부모에 월 전달
watch(
  [
    currentMonthDate,
    () => appliedFilter.value.period,
    () => appliedFilter.value.startDate,
    () => appliedFilter.value.endDate,
  ],
  () => {
    emit('month-change', {
      date: currentMonthDate.value,
      period: appliedFilter.value.period,
      startDate: appliedFilter.value.startDate,
      endDate: appliedFilter.value.endDate,
    })
  },
)

const prevMonth = () => {
  currentMonthDate.value = subMonths(currentMonthDate.value, 1)
}
const nextMonth = () => {
  currentMonthDate.value = addMonths(currentMonthDate.value, 1)
}

// 월 표기
const displayMonth = computed(() => format(currentMonthDate.value, 'M월'))

const isFilterOpen = ref(false)
const openFilter = () => (isFilterOpen.value = true)
const closeFilter = () => (isFilterOpen.value = false)
const applyFilter = (filter: typeof appliedFilter.value) => {
  appliedFilter.value = filter

  if (filter.period === '이번달') {
    currentMonthDate.value = new Date()
  } else if (filter.period === '지난달') {
    currentMonthDate.value = subMonths(new Date(), 1)
  }
}

// 거래 내역 필터링
const filteredHistories = computed(() => {
  let list = [...props.histories]

  const start = startOfMonth(currentMonthDate.value).getTime()
  const end = endOfMonth(currentMonthDate.value).getTime()

  list = list.filter((h) => {
    const historyDate = new Date(h.createdAt).getTime()
    return historyDate >= start && historyDate <= end
  })

  if (appliedFilter.value.type === '입금만') {
    list = list.filter((h) => h.direction === 'INCOME')
  } else if (appliedFilter.value.type === '출금만') {
    list = list.filter((h) => h.direction === 'EXPENSE')
  }

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
    <div class="flex items-center justify-between bg-Gray-1 p-[1rem]">
      <!-- 월 이동 -->
      <div v-if="appliedFilter.period !== '직접 설정'" class="flex items-center gap-2">
        <button class="px-[0.2rem] text-Gray-5" @click="prevMonth"><ChevronLeft /></button>
        <span class="Body00">{{ displayMonth }}</span>
        <button class="px-[0.2rem] text-Gray-5" @click="nextMonth"><ChevronRight /></button>
      </div>

      <!-- 필터 버튼 -->
      <button class="flex items-center gap-1 Body02 text-Gray-5 ml-auto" @click="openFilter">
        <template
          v-if="
            appliedFilter.period === '직접 설정' && appliedFilter.startDate && appliedFilter.endDate
          "
        >
          {{ appliedFilter.startDate.toLocaleDateString() }} ~
          {{ appliedFilter.endDate.toLocaleDateString() }} {{ appliedFilter.type }} ·
          {{ appliedFilter.order }}
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
    <div class="p-[1rem] pl-[2rem] pr-[2rem]">
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
