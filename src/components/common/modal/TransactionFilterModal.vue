<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { subMonths } from 'date-fns'
import DanjiButton from '../button/DanjiButton.vue'

const props = defineProps<{
  initialFilter: {
    period: string
    type: string
    order: string
    startDate: Date | null
    endDate: Date | null
  }
}>()

const emit = defineEmits<{
  (
    e: 'confirm',
    filter: {
      period: string
      type: string
      order: string
      startDate: Date | null
      endDate: Date | null
    },
  ): void
  (e: 'close'): void
}>()

// 상태
const period = ref<'이번달' | '지난달' | '직접 설정'>('이번달')
const type = ref(props.initialFilter.type)
const order = ref(props.initialFilter.order)
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)

// 버튼 스타일
const getButtonClass = (isActive: boolean) =>
  isActive ? 'text-Black-1 bg-Gray-3' : 'text-Gray-7 bg-Gray-1'

// 기간 선택 함수
const selectPeriod = (label: '이번달' | '지난달' | '직접 설정') => {
  period.value = label

  const today = new Date()
  if (label === '이번달') {
    startDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
    endDate.value = today
  } else if (label === '지난달') {
    const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    startDate.value = firstDayLastMonth
    endDate.value = lastDayLastMonth
  }
}

// 모달 열릴 때 자동 초기화 → 항상 오늘 기준
onMounted(() => {
  if (props.initialFilter.period === '지난달') {
    selectPeriod('지난달')
  } else if (props.initialFilter.period === '직접 설정') {
    // 직접 설정인 경우, 전달된 시작/종료 날짜도 함께 초기화
    selectPeriod('직접 설정')
    startDate.value = props.initialFilter.startDate
    endDate.value = props.initialFilter.endDate
  } else {
    selectPeriod('이번달')
  }
})

// 확인 버튼
const confirmFilter = () => {
  emit('confirm', {
    period: period.value,
    type: type.value,
    order: order.value,
    startDate: startDate.value,
    endDate: endDate.value,
  })
  emit('close')
}
</script>

<template>
  <!-- 배경 -->
  <div class="fixed inset-0 bg-Black-2/50 z-40" @click="emit('close')"></div>

  <!-- 모달 -->
  <div class="fixed bottom-0 left-0 right-0 rounded-t-2xl p-[2.5rem] z-50 bg-White-0">
    <!-- 조회 기간 -->
    <p class="mb-[0.5rem] Black-2 Body03">조회 기간</p>
    <div class="flex gap-2 mb-4">
      <button
        class="flex-1 py-[1rem] rounded Body04"
        :class="getButtonClass(period === '이번달')"
        @click="selectPeriod('이번달')"
      >
        이번달
      </button>
      <button
        class="flex-1 py-[1rem] rounded Body04"
        :class="getButtonClass(period === '지난달')"
        @click="selectPeriod('지난달')"
      >
        지난달
      </button>
      <button
        class="flex-1 py-[1rem] rounded Body04"
        :class="getButtonClass(period === '직접 설정')"
        @click="selectPeriod('직접 설정')"
      >
        직접 설정
      </button>
    </div>

    <!-- 직접 설정일 때만 DatePicker 표시 -->
    <div v-if="period === '직접 설정'" class="flex items-center gap-2 mb-[0.8rem]">
      <DatePicker v-model:value="startDate" type="date" format="YYYY-MM-DD">
        <template #input>
          <div class="border rounded-md w-full text-center py-[0.8rem] cursor-pointer">
            {{ startDate ? startDate.toLocaleDateString() : '시작일 선택' }}
          </div>
        </template>
      </DatePicker>
      <span>-</span>
      <DatePicker v-model:value="endDate" type="date" format="YYYY-MM-DD">
        <template #input>
          <div class="border rounded-md w-full text-center py-[0.8rem] cursor-pointer">
            {{ endDate ? endDate.toLocaleDateString() : '종료일 선택' }}
          </div>
        </template>
      </DatePicker>
    </div>

    <!-- 거래 유형 -->
    <p class="mb-[0.5rem] Black-2 Body03">거래 유형</p>
    <div class="flex gap-2 mb-[1rem]">
      <button
        class="flex-1 py-[1rem] rounded Body04"
        :class="getButtonClass(type === '전체')"
        @click="type = '전체'"
      >
        전체
      </button>
      <button
        class="flex-1 py-[1rem] rounded Body04"
        :class="getButtonClass(type === '입금만')"
        @click="type = '입금만'"
      >
        입금만
      </button>
      <button
        class="flex-1 py-[1rem] rounded Body04"
        :class="getButtonClass(type === '출금만')"
        @click="type = '출금만'"
      >
        출금만
      </button>
    </div>

    <!-- 정렬 -->
    <p class="mb-[0.5rem] Black-2 Body03">거래내역 정렬</p>
    <div class="flex gap-2 pb-[1rem]">
      <button
        class="flex-1 py-[1rem] rounded Body04"
        :class="getButtonClass(order === '최신순')"
        @click="order = '최신순'"
      >
        최신순
      </button>
      <button
        class="flex-1 py-[1rem] rounded Body04"
        :class="getButtonClass(order === '오래된 순')"
        @click="order = '오래된 순'"
      >
        오래된 순
      </button>
    </div>

    <!-- 확인 버튼 -->
    <danji-button variant="large" @click="confirmFilter">확인</danji-button>
  </div>
</template>
