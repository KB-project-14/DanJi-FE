<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import CardHistoryItemList from '@/components/common/history/CardHistoryItemList.vue'
import TransactionFilterModal from '@/components/common/modal/TransactionFilterModal.vue'

const transaction = [
  {
    comment: '가맹점',
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
]

// 필터링 모달
const isFilterOpen = ref(false)
const appliedFilter = ref({ period: '3개월', type: '전체', order: '최신순' })

const openFilter = () => (isFilterOpen.value = true)
const closeFilter = () => (isFilterOpen.value = false)
const applyFilter = (filter: any) => {
  appliedFilter.value = filter
}
</script>

<template>
  <layout :header-type="'basic'" :header-title="'제목'" :is-bottom-nav="false" :showLeftIcon="true">
    <template #content>
      <card-history-item-list :histories="transaction" />
      <!-- 필터링 모달 -->
      <transaction-filter-modal v-if="isFilterOpen" @close="closeFilter" @confirm="applyFilter" />
    </template>
  </layout>
</template>
