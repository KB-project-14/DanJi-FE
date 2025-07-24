<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
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

// 디폴트 값 (추후 API 연동 예정)
const appliedFilter = ref<{
  period: string
  type: string
  order: string
  startDate: Date | null
  endDate: Date | null
}>({
  period: '1개월',
  type: '전체',
  order: '최신순',
  startDate: null,
  endDate: null,
})

const isFilterOpen = ref(false)
const openFilter = () => (isFilterOpen.value = true)
const closeFilter = () => (isFilterOpen.value = false)

const applyFilter = (filter: {
  period: string
  type: string
  order: string
  startDate: Date | null
  endDate: Date | null
}) => {
  appliedFilter.value = filter
}

const filteredHistories = computed(() => {
  let list = [...props.histories]

  // 날짜 필터링
  if (appliedFilter.value.startDate && appliedFilter.value.endDate) {
    const start = appliedFilter.value.startDate.getTime()
    const end = appliedFilter.value.endDate.getTime()
    list = list.filter((h) => {
      const historyDate = new Date(h.createdAt).getTime()
      return historyDate >= start && historyDate <= end
    })
  }

  // 거래 유형
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
    <!-- 상단 헤더 -->
    <div class="flex items-center p-[1rem] pr-[1.4rem] pl-[1.4rem] bg-Gray-1">
      <button class="flex items-center gap-1 Body02 text-Gray-5 ml-auto" @click="openFilter">
        {{ appliedFilter.period }} · {{ appliedFilter.type }} · {{ appliedFilter.order }}
        <ChevronDown class="w-[1.6rem] h-[1.6rem]" />
      </button>
      <!-- 필터 모달 -->
      <transaction-filter-modal
        v-if="isFilterOpen"
        :initial-filter="appliedFilter"
        @close="closeFilter"
        @confirm="applyFilter"
      />
    </div>

    <div class="p-[1rem] pr-[1.4rem] pl-[1.4rem]">
      <!-- 거래 내역 리스트 -->
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
    </div>
  </div>
</template>
