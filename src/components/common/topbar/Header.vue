<script lang="ts" setup>
import '@/assets/styles/main.css'
import { defineProps, defineEmits } from 'vue'
import { ChevronLeft, XCircle } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title: string
    showLeftIcon?: boolean
    showRightIcon?: boolean
  }>(),
  {
    showLeftIcon: false,
    showRightIcon: false,
  },
)

const emits = defineEmits<{
  (e: 'left-click'): void
  (e: 'right-click'): void
}>()

const onLeftClick = () => emits('left-click')
const onRightClick = () => emits('right-click')
</script>

<template>
  <div class="relative flex items-center justify-center px-3 h-[7.2rem] bg-white">
    <div
      v-if="showLeftIcon"
      class="absolute left-0 pl-3 flex items-center cursor-pointer"
      @click="onLeftClick"
      role="button"
      aria-label="뒤로가기"
    >
      <ChevronLeft :size="24" />
    </div>

    <div class="text-center Head01">{{ title }}</div>

    <div
      v-if="showRightIcon"
      class="absolute right-0 pr-3 flex items-center cursor-pointer"
      @click="onRightClick"
    >
      <XCircle :size="24" class="text-Gray-5" role="button" aria-label="닫기" />
    </div>
  </div>
</template>
