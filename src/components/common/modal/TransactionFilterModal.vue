<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DanjiButton from '../button/DanjiButton.vue'

const emit = defineEmits<{
  (e: 'confirm', filter: { period: string; type: string; order: string }): void
  (e: 'close'): void
}>()

const period = ref('3개월')
const type = ref('전체')
const order = ref('최신순')

const isVisible = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true
  })
})

const confirmFilter = () => {
  emit('confirm', { period: period.value, type: type.value, order: order.value })
  emit('close')
}

// 색상 조건부 함수
const getButtonClass = (isActive: boolean) =>
  isActive ? 'text-Black-1 bg-Gray-3' : 'text-Gray-7 bg-Gray-1'
</script>

<template>
  <!-- 배경 -->
  <div class="fixed inset-0 bg-Black-2/50 z-40" @click="emit('close')"></div>

  <!-- 모달 -->
  <div
    class="fixed bottom-0 left-0 right-0 rounded-t-2xl p-[2.5rem] z-50 transition-transform duration-300 bg-White-0"
    :class="isVisible ? 'translate-y-0' : 'translate-y-full'"
  >
    <div class="pr-[0.5rem] pl-[0.5rem]">
      <!-- 조회 기간 -->
      <div class="mb-[1.6rem]">
        <p class="mb-[0.5rem] Black-2 Body03">조회 기간</p>
        <div class="flex gap-2">
          <button
            class="flex-1 py-[1rem] rounded Body04"
            :class="getButtonClass(period === '1개월')"
            @click="period = '1개월'"
          >
            1개월
          </button>
          <button
            class="flex-1 py-[1rem] rounded Body04"
            :class="getButtonClass(period === '3개월')"
            @click="period = '3개월'"
          >
            3개월
          </button>
          <button
            class="flex-1 py-[1rem] rounded Body04"
            :class="getButtonClass(period === '직접 설정')"
            @click="period = '직접 설정'"
          >
            직접 설정
          </button>
        </div>
      </div>

      <!-- 거래 유형 -->
      <div class="mb-[1.6rem]">
        <p class="mb-[0.5rem] Black-2 Body03">거래 유형</p>
        <div class="flex gap-2">
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
      </div>

      <!-- 정렬 -->
      <div class="mb-[1.6rem]">
        <p class="mb-[0.5rem] Black-2 Body03">거래내역 정렬</p>
        <div class="flex gap-2">
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
      </div>
    </div>

    <!-- 확인 버튼 -->
    <div>
      <DanjiButton variant="large" @click="confirmFilter"> 확인</DanjiButton>
    </div>
  </div>
</template>
