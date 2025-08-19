<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { LocalStoreResponseDTO } from '@/types/store/storeTypes'
import LocalStoreItem from './LocalStoreItem.vue'

const props = defineProps<{
  isModalFold: boolean
  localStoreList: LocalStoreResponseDTO[]
}>()

interface Emit {
  (e: 'select-place', payload: { lat: number; lng: number; name: string; id: string }): void
}

const emit = defineEmits<Emit>()

const sheetRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startY = ref(0)
const initialSheetY = ref(0)

const MIN_POSITION_WITH_NAV = 0.35
const MIN_POSITION_WITHOUT_NAV = 0.2
const MAX_POSITION = 0.9

const getYPosition = (percent: number) => window.innerHeight * percent

const getCurrentSheetY = (): number => {
  if (!sheetRef.value) return getYPosition(0.8)
  const transform = sheetRef.value.style.transform
  const match = transform.match(/translateY\(([^)]+)px\)/)
  return match ? parseFloat(match[1]) : getYPosition(0.8)
}

const setSheetPosition = (y: number) => {
  if (!sheetRef.value) return

  const minY = props.isModalFold
    ? getYPosition(MIN_POSITION_WITH_NAV)
    : getYPosition(MIN_POSITION_WITHOUT_NAV)
  const maxY = getYPosition(MAX_POSITION)
  const clampedY = Math.min(Math.max(y, minY), maxY)

  sheetRef.value.style.transform = `translateY(${clampedY}px)`
}

const handleStart = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isDragging.value = true
  startY.value = 'touches' in e ? e.touches[0].clientY : e.clientY
  initialSheetY.value = getCurrentSheetY()

  if (sheetRef.value) {
    sheetRef.value.style.transition = ''
  }
}

const handleMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  e.preventDefault()
  const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const deltaY = currentY - startY.value

  setSheetPosition(initialSheetY.value + deltaY)
}

const handleEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
}

const resetToInitialPosition = () => {
  if (!sheetRef.value) return

  const targetY = props.isModalFold ? getYPosition(MAX_POSITION) : getYPosition(0.7)

  sheetRef.value.style.transition = 'transform 0.3s ease'
  sheetRef.value.style.transform = `translateY(${targetY}px)`

  setTimeout(() => {
    if (sheetRef.value) sheetRef.value.style.transition = ''
  }, 300)
}

const handleSelectPlace = (payload: { lat: number; lng: number; name: string; id: string }) => {
  emit('select-place', payload)
}

onMounted(() => {
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove, { passive: false })
  document.addEventListener('touchend', handleEnd)

  nextTick(() => {
    const initialY = props.isModalFold ? getYPosition(MAX_POSITION) : getYPosition(0.7)
    setSheetPosition(initialY)
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMove)
  document.removeEventListener('mouseup', handleEnd)
  document.removeEventListener('touchmove', handleMove)
  document.removeEventListener('touchend', handleEnd)
})

watch(() => props.isModalFold, resetToInitialPosition)
</script>

<template>
  <div ref="sheetRef" class="fixed w-full mx-auto bg-White-0 rounded-t-[2rem] shadow-xl">
    <div
      class="w-full flex justify-center py-[1.4rem] cursor-grab active:cursor-grabbing"
      @mousedown="handleStart"
      @touchstart="handleStart"
    >
      <div class="w-[42px] h-[4px] bg-Gray-1 rounded-full"></div>
    </div>

    <div class="flex justify-between items-center mx-[2rem]">
      <span class="Head02 text-Black-1">가맹점 리스트</span>
      <span class="Body01 text-Gray-4">{{ isModalFold ? '내 위치' : '지도 위치' }} 기준</span>
    </div>

    <hr class="mt-[1.4rem] border-t border-Gray-0" />

    <div class="overflow-y-auto scrollbar-hide" :style="{ maxHeight: 'calc(90vh - 8rem)' }">
      <local-store-item
        v-for="localStore in localStoreList"
        :key="localStore.availableMerchantId"
        :local-store="localStore"
        @select-place="handleSelectPlace"
      />

      <div class="h-[15rem]"></div>
    </div>
  </div>
</template>
