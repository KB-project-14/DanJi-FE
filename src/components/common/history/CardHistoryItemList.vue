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
const appliedFilter = ref({
  period: '1개월',
  type: '전체',
  order: '최신순',
})

const isFilterOpen = ref(false)
const openFilter = () => (isFilterOpen.value = true)
const closeFilter = () => (isFilterOpen.value = false)

const applyFilter = (filter: { period: string; type: string; order: string }) => {
  appliedFilter.value = filter
}

const filteredHistories = computed(() => {
  let list = [...props.histories]

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

  // 기간 필터링 (UI용 / 실제 API 연동 시 서버에서 처리 예정)
  if (appliedFilter.value.period === '3개월') {
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    list = list.filter((h) => new Date(h.createdAt) >= threeMonthsAgo)
  }
  // 1개월, 직접 설정은 나중에 API 연동 시 처리

  return list
})
</script>

<template>
  <div class="flex flex-col">
    <!-- 상단 헤더 -->
    <div class="flex justify-between items-center p-[1rem] pr-[1.4rem] pl-[1.4rem] bg-Gray-1">
      <span class="text-Gray-7 Body00"> 이용내역</span>
      <button class="flex items-center gap-1 Body02 text-Gray-5" @click="openFilter">
        {{ appliedFilter.period }} · {{ appliedFilter.type }} · {{ appliedFilter.order }}
        <ChevronDown class="w-[1.6rem] h-[1.6rem]" />
      </button>
      <!-- 필터 모달 -->
      <transaction-filter-modal v-if="isFilterOpen" @close="closeFilter" @confirm="applyFilter" />
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
