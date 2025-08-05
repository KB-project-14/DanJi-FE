<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { ChevronDown } from 'lucide-vue-next'

import CardHistoryItem from './CardHistoryItem.vue'
import TransactionFilterModal from '../modal/TransactionFilterModal.vue'
import type { FilterType } from '@/types/wallet/FilterType'
import type { Transaction } from '@/types/transaction/TransactionType'

// Props - 부모에서 데이터와 필터를 받음
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

// 거래내역 (props에서 받은 데이터 사용)
const histories = computed(() => props.transactions ?? [])

// 모달 상태
const isFilterOpen = ref(false)
const openFilter = () => (isFilterOpen.value = true)
const closeFilter = () => (isFilterOpen.value = false)

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
    <!-- 필터 버튼 -->
    <div class="flex items-center justify-end bg-Gray-1 p-[1rem]">
      <button class="flex items-center gap-1 Body02 text-Gray-5" @click="openFilter">
        {{ filterText }}
        <ChevronDown class="w-[1.4rem] h-[1.4rem]" />
      </button>
    </div>

    <!-- 필터 모달 -->
    <TransactionFilterModal
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
        <CardHistoryItem
          v-for="(history, index) in histories"
          :key="`${history.id || index}-${history.createdAt}`"
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
