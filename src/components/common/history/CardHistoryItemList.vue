<script setup lang="ts">
import CardHistoryItem from './CardHistoryItem.vue'

defineProps<{
  histories: {
    comment: string // 가맹점명
    amount: number // 거래 금액
    afterBalance: number // 거래 후 잔액
    direction: 'INCOME' | 'EXPENSE' // 수입, 지출
    type: 'CHARGE' | 'REFUND' | 'CONVERT' | 'PAYMENT' // 충전, 환불 등등
    createdAt: string // 결제 시간
  }[]
}>()
</script>
<template>
  <div class="flex flex-col">
    <card-history-item
      v-for="(history, index) in histories"
      :key="index"
      :comment="history.comment"
      :amount="history.amount"
      :afterBalance="history.afterBalance"
      :direction="history.direction"
      :type="history.type"
      :createdAt="history.createdAt"
    />
  </div>
</template>
