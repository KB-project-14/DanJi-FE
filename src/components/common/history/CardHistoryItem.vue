<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  comment: string
  amount: number
  afterBalance: number
  direction: 'INCOME' | 'EXPENSE'
  type: 'CHARGE' | 'REFUND' | 'CONVERT' | 'PAYMENT'
  createdAt: string
}>()

// 거래 유형 별 comment
const getDisplayText = (direction: string, type: string) => {
  if (type === 'REFUND') return '결제 취소'
  if (direction === 'INCOME') return '입금'
  return '출금'
}

// 색상
const getAmountColor = (direction: string) => {
  return direction === 'INCOME' ? 'text-Blue-0' : 'text-Red-0'
}

// 날짜 표기법 통일
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return format(date, 'yyyy.MM.dd HH:mm:ss')
}
</script>

<template>
  <div class="flex flex-col py-[1.6rem] border-b border-Gray-1">
    <!-- 상호명 + 결제 금액 -->
    <div class="flex justify-between pb-[0.5rem] items-center">
      <span class="Head02 text-Black-2">{{ props.comment }}</span>
      <span :class="['Head02', getAmountColor(props.direction)]">
        {{ getDisplayText(props.direction, props.type) }} {{ props.amount.toLocaleString() }} 원
      </span>
    </div>

    <!-- 결제 시간 + 결제 후 잔액 -->
    <div class="flex justify-between mt-[0.4rem] Body04 text-Gray-5">
      <span>{{ formatDateTime(createdAt) }}</span>
      <span>잔액 {{ (afterBalance ?? 0).toLocaleString() }} 원</span>
    </div>
  </div>
</template>
