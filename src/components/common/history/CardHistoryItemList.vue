<script setup lang="ts">
import { ref, computed } from 'vue'
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'

import CardHistoryItem from './CardHistoryItem.vue'
import TransactionFilterModal from '../modal/TransactionFilterModal.vue'
import type { FilterType } from '@/types/wallet/FilterType'
import type { Transaction } from '@/types/transaction/TransactionType'

const props = defineProps<{
  walletId: string
  transactions: Transaction[] // 거래내역 데이터
  filter: FilterType // 현재 필터 상태
  isLoading?: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:filter', value: FilterType): void
}>()

// 거래내역
const histories = computed(() => props.transactions ?? [])

// 모달 상태
const isFilterOpen = ref(false)
const openFilter = () => (isFilterOpen.value = true)
const closeFilter = () => (isFilterOpen.value = false)

// 현재 선택된 월 (필터의 startDate 기준)
const currentMonth = computed(() => {
  return props.filter.startDate || new Date()
})

// 월 표시 텍스트
const monthText = computed(() => {
  const month = currentMonth.value
  return `${month.getMonth() + 1}월`
})

// 월 변경 핸들러
const changeMonth = (direction: 'prev' | 'next') => {
  const currentDate = currentMonth.value
  const newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1)

  const newFilter: FilterType = {
    ...props.filter,
    period: '이번달', // 월 변경 시 기본값으로 설정
    startDate: startOfMonth(newDate),
    endDate: endOfMonth(newDate),
  }

  emit('update:filter', newFilter)
}

// 필터 업데이트 핸들러
const handleFilterUpdate = (newFilter: FilterType) => {
  emit('update:filter', newFilter)
}

// 날짜 포맷
const formatDate = (date: Date | null) => (date ? format(date, 'yyyy.MM.dd') : '')

// 필터 텍스트 표시
const filterText = computed(() => {
  if (props.filter.period === '직접 설정' && props.filter.startDate && props.filter.endDate) {
    return `${formatDate(props.filter.startDate)} ~ ${formatDate(props.filter.endDate)} · ${props.filter.type} · ${props.filter.order}`
  }
  return `${props.filter.period} · ${props.filter.type} · ${props.filter.order}`
})
</script>

<template>
  <div class="flex flex-col">
    <!-- 상단 필터/월 선택 영역 -->
    <div class="flex items-center justify-between bg-Gray-1 p-[1rem]">
      <!-- 월 네비게이션 (왼쪽) -->
      <div class="flex items-center gap-3">
        <button class="p-1 rounded-full" @click="changeMonth('prev')">
          <ChevronLeft class="w-[1.6rem] h-[1.6rem] text-Gray-6" />
        </button>

        <span class="Head02 text-Black-2 min-w-[3rem] text-center">
          {{ monthText }}
        </span>

        <button class="p-1 rounded-full" @click="changeMonth('next')">
          <ChevronRight class="w-[1.6rem] h-[1.6rem] text-Gray-6" />
        </button>
      </div>

      <!-- 필터 버튼 (오른쪽) -->
      <button class="flex items-center gap-1 Body02 text-Gray-5" @click="openFilter">
        {{ filterText }}
        <ChevronDown class="w-[1.4rem] h-[1.4rem]" />
      </button>
    </div>

    <!-- 필터 모달 -->
    <transaction-filter-modal
      v-if="isFilterOpen"
      :modelValue="filter"
      @update:modelValue="handleFilterUpdate"
      @close="closeFilter"
    />

    <!-- 거래 내역 리스트 -->
    <div class="p-[1rem] pl-[2rem] pr-[2rem]">
      <!-- 로딩 상태 -->
      <template v-if="isLoading">
        <div class="flex flex-col items-center justify-center py-8 text-Gray-5 Body02">
          <p>로딩 중...</p>
        </div>
      </template>

      <!-- 거래 내역 있을 때 -->
      <template v-else-if="histories.length > 0">
        <card-history-item
          v-for="(history, index) in histories"
          :key="`transaction-${index}-${history.createdAt}`"
          :comment="history.comment"
          :amount="history.amount"
          :afterBalance="history.afterBalance"
          :direction="history.direction"
          :type="history.type"
          :createdAt="history.createdAt"
        />
      </template>

      <!-- 거래 내역 없을 때 -->
      <template v-else>
        <div class="flex flex-col items-center justify-center py-8 text-Gray-5 Body02">
          <p>이용 내역이 없습니다.</p>
        </div>
      </template>
    </div>
  </div>
</template>
