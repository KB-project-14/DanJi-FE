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
  transactions: Transaction[]
  filter: FilterType
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:filter', value: FilterType): void
}>()

const histories = computed(() => props.transactions ?? [])

const isFilterOpen = ref(false)
const openFilter = () => (isFilterOpen.value = true)
const closeFilter = () => (isFilterOpen.value = false)

const currentMonth = computed(() => {
  return props.filter.startDate || new Date()
})

const monthText = computed(() => {
  const month = currentMonth.value
  return `${month.getMonth() + 1}월`
})

const changeMonth = (direction: 'prev' | 'next') => {
  const currentDate = currentMonth.value
  const newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1)

  const newFilter: FilterType = {
    ...props.filter,
    period: '이번달',
    startDate: startOfMonth(newDate),
    endDate: endOfMonth(newDate),
  }

  emit('update:filter', newFilter)
}

const handleFilterUpdate = (newFilter: FilterType) => {
  emit('update:filter', newFilter)
}

const formatDate = (date: Date | null) => (date ? format(date, 'yyyy.MM.dd') : '')

const filterText = computed(() => {
  if (props.filter.period === '직접 설정' && props.filter.startDate && props.filter.endDate) {
    return `${formatDate(props.filter.startDate)} ~ ${formatDate(props.filter.endDate)} · ${props.filter.type} · ${props.filter.order}`
  }
  return `${props.filter.period} · ${props.filter.type} · ${props.filter.order}`
})
</script>

<template>
  <div class="flex flex-col">
    <div
      class="flex items-center bg-Gray-1 p-[1rem]"
      :class="filter.period === '직접 설정' ? 'justify-end' : 'justify-between'"
    >
      <div v-if="filter.period !== '직접 설정'" class="flex items-center gap-3">
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

      <button class="flex items-center gap-1 Body02 text-Gray-5" @click="openFilter">
        {{ filterText }}
        <ChevronDown class="w-[1.4rem] h-[1.4rem]" />
      </button>
    </div>

    <transaction-filter-modal
      v-if="isFilterOpen"
      :modelValue="filter"
      @update:modelValue="handleFilterUpdate"
      @close="closeFilter"
    />

    <div class="p-[1rem] pl-[2rem] pr-[2rem]">
      <template v-if="isLoading">
        <div class="flex flex-col items-center justify-center py-8 text-Gray-5 Body02">
          <p>로딩 중...</p>
        </div>
      </template>

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

      <template v-else>
        <div class="flex flex-col items-center justify-center py-8 text-Gray-5 Body02">
          <p>이용 내역이 없습니다.</p>
        </div>
      </template>
    </div>
  </div>
</template>
