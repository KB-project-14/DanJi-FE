<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import DatePicker from 'vue-datepicker-next'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import 'vue-datepicker-next/index.css'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import type { FilterType } from '@/types/wallet/FilterType'

const props = defineProps<{
  modelValue: FilterType
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterType): void
  (e: 'close'): void
}>()

const period = ref<'이번달' | '지난달' | '직접 설정'>(props.modelValue.period as any)
const type = ref(props.modelValue.type)
const order = ref(props.modelValue.order)
const startDate = ref<Date | null>(props.modelValue.startDate)
const endDate = ref<Date | null>(props.modelValue.endDate)

const getButtonClass = (isActive: boolean) =>
  isActive ? 'text-Black-1 bg-Gray-3' : 'text-Gray-7 bg-Gray-1'

const selectPeriod = (label: '이번달' | '지난달' | '직접 설정') => {
  period.value = label

  const today = new Date()

  if (label === '이번달') {
    startDate.value = startOfMonth(today)
    endDate.value = today
  } else if (label === '지난달') {
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    startDate.value = startOfMonth(lastMonth)
    endDate.value = endOfMonth(lastMonth)
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    period.value = newValue.period as any
    type.value = newValue.type
    order.value = newValue.order
    startDate.value = newValue.startDate
    endDate.value = newValue.endDate
  },
  { immediate: true },
)

onMounted(() => {
  if (!startDate.value || !endDate.value) {
    selectPeriod(period.value)
  }
})

const confirmFilter = () => {
  if (!startDate.value || !endDate.value) {
    alert('날짜를 선택해주세요.')
    return
  }

  if (startDate.value > endDate.value) {
    alert('시작 날짜는 종료 날짜보다 이전이어야 합니다.')
    return
  }

  const filterValue: FilterType = {
    period: period.value,
    type: type.value,
    order: order.value,
    startDate: startDate.value,
    endDate: endDate.value,
  }
  emit('update:modelValue', filterValue)
  emit('close')
}

const handleBackgroundClick = (e: Event) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

const formatDate = (date: Date | null) => (date ? format(date, 'yyyy.MM.dd') : '날짜 선택')
</script>

<template>
  <div class="fixed inset-0 bg-Black-2/50 z-40" @click="handleBackgroundClick">
    <div class="fixed bottom-0 left-0 right-0 rounded-t-2xl p-[2.5rem] z-50 bg-White-0" @click.stop>
      <p class="mb-[0.5rem] text-Black-2 Body03">조회 기간</p>
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

      <div v-if="period === '직접 설정'" class="flex items-center gap-2 mb-[0.8rem]">
        <DatePicker v-model:value="startDate" type="date" format="YYYY-MM-DD">
          <template #input>
            <div class="border rounded-md w-full text-center py-[0.8rem] cursor-pointer Body04">
              {{ formatDate(startDate) }}
            </div>
          </template>
        </DatePicker>
        <span class="text-Gray-5">~</span>
        <DatePicker v-model:value="endDate" type="date" format="YYYY-MM-DD">
          <template #input>
            <div class="border rounded-md w-full text-center py-[0.8rem] cursor-pointer Body04">
              {{ formatDate(endDate) }}
            </div>
          </template>
        </DatePicker>
      </div>

      <p class="mb-[0.5rem] text-Black-2 Body03">거래 유형</p>
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

      <p class="mb-[0.5rem] text-Black-2 Body03">거래내역 정렬</p>
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

      <danji-button variant="large" @click="confirmFilter">확인</danji-button>
    </div>
  </div>
</template>
