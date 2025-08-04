<script setup lang="ts">
import { format } from 'date-fns'

defineProps<{
  comment: string // 가맹점명
  amount: number // 거래 금액
  afterBalance: number // 거래 후 잔액
  direction: 'INCOME' | 'EXPENSE' // 수입, 지출
  type: 'CHARGE' | 'REFUND' | 'CONVERT' | 'PAYMENT' // 충전, 환불 등등
  createdAt: string // 결제 시간
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
      <span class="Head02 text-Black2">{{ comment }}</span>
      <span :class="['Head02', getAmountColor(direction)]">
        {{ getDisplayText(direction, type) }} {{ (amount ?? 0).toLocaleString() }} 원
      </span>
    </div>

    <!-- 결제 시간 + 결제 후 잔액 -->
    <div class="flex justify-between mt-[0.4rem] Body04 text-Gray-5">
      <span>{{ formatDateTime(createdAt) }}</span>
      <span>잔액 {{ (afterBalance ?? 0).toLocaleString() }} 원</span>
    </div>
  </div>
</template>
