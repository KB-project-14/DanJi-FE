<script lang="ts" setup>
import '@/assets/styles/main.css'
import { defineProps, defineEmits } from 'vue'
import { ChevronLeft, XCircle } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  showLeftIcon?: boolean
  showRightIcon?: boolean
}>()

const emits = defineEmits<{
  (e: 'left-click'): void
  (e: 'right-click'): void
}>()

const onLeftClick = () => emits('left-click')
const onRightClick = () => emits('right-click')
</script>

<template>
  <div class="header-wrapper d-flex align-items-center justify-content-center bg-white px-3">
    <!-- 왼쪽 아이콘 -->
    <div
      v-if="showLeftIcon"
      class="left-icon position-absolute start-0 ps-3 d-flex align-items-center"
      @click="onLeftClick"
      role="button"
      aria-label="뒤로가기"
    >
      <ChevronLeft :size="24" />
    </div>

    <!-- 제목 -->
    <div class="Head0 text-center">{{ title }}</div>

    <!-- 오른쪽 아이콘 -->
    <div
      v-if="showRightIcon"
      class="right-icon position-absolute end-0 pe-3 d-flex align-items-center"
      @click="onRightClick"
    >
      <XCircle :size="24" class="close-icon" />
    </div>
  </div>
</template>

<style scoped>
.header-wrapper {
  height: 4rem;
}

.left-icon,
.right-icon {
  cursor: pointer;
}

.close-icon {
  color: var(--Gray05);
}
</style>
