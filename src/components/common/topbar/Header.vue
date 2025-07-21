<script lang="ts" setup>
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
  <div
    class="position-relative d-flex align-items-center justify-content-center border-bottom bg-white px-3"
    style="height: 4rem"
  >
    <!-- 왼쪽 아이콘(뒤로가기) -->
    <div
      v-if="showLeftIcon"
      class="position-absolute start-0 ps-3 d-flex align-items-center"
      @click="onLeftClick"
      style="cursor: pointer"
    >
      <ChevronLeft :size="24" />
    </div>

    <!-- 제목 -->
    <div class="fw-semibold text-center">{{ title }}</div>

    <!-- 오른쪽 아이콘(닫기버튼) -->
    <div
      v-if="showRightIcon"
      class="position-absolute end-0 pe-3 d-flex align-items-center"
      @click="onRightClick"
      style="cursor: pointer"
    >
      <XCircle :size="1.5 * 16" style="color: var(--Gray05)" />
    </div>
  </div>
</template>
