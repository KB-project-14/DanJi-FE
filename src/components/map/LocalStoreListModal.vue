<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { LocalStore } from '@/types/types'
import LocalStoreItem from './LocalStoreItem.vue'

const props = defineProps<{
  isModalFold: boolean
  localStoreList: LocalStore[]
}>()

const sheetRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startY = ref(0)
const initialSheetY = ref(0)

// 시트 위치 범위 (화면 높이 기준)
const MIN_POSITION_WITH_NAV = 0.35
const MIN_POSITION_WITHOUT_NAV = 0.2
const MAX_POSITION = 0.9

const getYPosition = (percent: number) => window.innerHeight * percent

// 현재 시트 Y 위치 가져오기
const getCurrentSheetY = (): number => {
  if (!sheetRef.value) return getYPosition(0.8)
  const transform = sheetRef.value.style.transform
  const match = transform.match(/translateY\(([^)]+)px\)/)
  return match ? parseFloat(match[1]) : getYPosition(0.8)
}

// 시트 위치 설정 (경계 제한만 적용)
const setSheetPosition = (y: number) => {
  if (!sheetRef.value) return

  // 화면 경계를 벗어나지 않도록 제한
  const minY = props.isModalFold
    ? getYPosition(MIN_POSITION_WITH_NAV)
    : getYPosition(MIN_POSITION_WITHOUT_NAV)
  const maxY = getYPosition(MAX_POSITION)
  const clampedY = Math.min(Math.max(y, minY), maxY)

  sheetRef.value.style.transform = `translateY(${clampedY}px)`
}

// 드래그 시작
const handleStart = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isDragging.value = true
  startY.value = 'touches' in e ? e.touches[0].clientY : e.clientY
  initialSheetY.value = getCurrentSheetY()

  // 드래그 중에는 애니메이션 제거
  if (sheetRef.value) {
    sheetRef.value.style.transition = ''
  }
}

// 드래그 중 - 실시간으로 위치 업데이트
const handleMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  e.preventDefault()
  const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const deltaY = currentY - startY.value

  // 드래그한 만큼 시트 이동
  setSheetPosition(initialSheetY.value + deltaY)
}

// 드래그 종료 - 현재 위치에 그대로 멈춤
const handleEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
}

// props가 변경될 때만 초기 위치 설정
const resetToInitialPosition = () => {
  if (!sheetRef.value) return

  const targetY = props.isModalFold ? getYPosition(MAX_POSITION) : getYPosition(0.7)

  // 부드러운 애니메이션으로 초기 위치로 이동
  sheetRef.value.style.transition = 'transform 0.3s ease'
  sheetRef.value.style.transform = `translateY(${targetY}px)`

  setTimeout(() => {
    if (sheetRef.value) sheetRef.value.style.transition = ''
  }, 300)
}

onMounted(() => {
  // 이벤트 리스너 등록
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove, { passive: false })
  document.addEventListener('touchend', handleEnd)

  // 초기 위치 설정
  nextTick(() => {
    const initialY = props.isModalFold ? getYPosition(MAX_POSITION) : getYPosition(0.7)
    setSheetPosition(initialY)
  })
})

onUnmounted(() => {
  // 이벤트 리스너 해제
  document.removeEventListener('mousemove', handleMove)
  document.removeEventListener('mouseup', handleEnd)
  document.removeEventListener('touchmove', handleMove)
  document.removeEventListener('touchend', handleEnd)
})

// props 변경 감지
watch(() => props.isModalFold, resetToInitialPosition)
</script>

<template>
  <div
    ref="sheetRef"
    class="fixed w-full max-w-[37.5rem] mx-auto bg-White-0 rounded-t-[2rem] shadow-xl"
  >
    <!-- 드래그 핸들 -->
    <div
      class="w-full flex justify-center py-[1.4rem] cursor-grab active:cursor-grabbing"
      @mousedown="handleStart"
      @touchstart="handleStart"
    >
      <div class="w-[42px] h-[4px] bg-Gray-1 rounded-full"></div>
    </div>

    <!-- 헤더 -->
    <div class="flex justify-between items-center mx-[2rem]">
      <span class="Head02 text-Black-1">가맹점 리스트</span>
      <span class="Body01 text-Gray-4">{{ isModalFold ? '내 위치' : '지도 위치' }} 기준</span>
    </div>

    <hr class="mt-[1.4rem] border-t border-Gray-0" />

    <!-- 리스트 -->
    <div class="overflow-y-auto scrollbar-hide" :style="{ maxHeight: 'calc(90vh - 8rem)' }">
      <local-store-item
        v-for="localStore in localStoreList"
        :key="localStore.availableMerchantId"
        :local-store="localStore"
      />

      <div class="h-[15rem]"></div>
    </div>
  </div>
</template>
