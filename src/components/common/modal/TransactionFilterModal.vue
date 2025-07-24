<script setup lang="ts">
import { ref, watch, defineProps } from 'vue'
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

// 로컬 상태 (props 기반으로 초기화)
const period = ref<'1개월' | '3개월' | '직접 입력'>(props.initialFilter.period as any)
const type = ref(props.initialFilter.type)
const order = ref(props.initialFilter.order)
const startDate = ref<Date | null>(props.initialFilter.startDate || new Date())
const endDate = ref<Date | null>(props.initialFilter.endDate || new Date())

// 버튼
const getButtonClass = (isActive: boolean) =>
  isActive ? 'text-Black-1 bg-Gray-3' : 'text-Gray-7 bg-Gray-1'

// 기간 선택
const selectPeriod = (label: '1개월' | '3개월' | '직접 입력', months?: number) => {
  period.value = label
  if (months) {
    const today = new Date()
    startDate.value = subMonths(today, months)
    endDate.value = today
  }
}

// 확인 버튼 눌러야만 필터링 적용
const confirmFilter = () => {
  const periodText =
    period.value === '직접 입력'
      ? `${startDate.value?.toLocaleDateString()} ~ ${endDate.value?.toLocaleDateString()}`
      : period.value

  emit('confirm', {
    period: periodText,
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
        :class="getButtonClass(period === '1개월')"
        @click="selectPeriod('1개월', 1)"
      >
        1개월
      </button>
      <button
        class="flex-1 py-[1rem] rounded Body04"
        :class="getButtonClass(period === '3개월')"
        @click="selectPeriod('3개월', 3)"
      >
        3개월
      </button>
      <button
        class="flex-1 py-[1rem] rounded Body04"
        :class="getButtonClass(period === '직접 입력')"
        @click="selectPeriod('직접 입력')"
      >
        직접 설정
      </button>
    </div>

    <!--  DatePicker -->
    <div v-if="period === '직접 입력'" class="flex items-center gap-2 mb-[0.8rem]">
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
