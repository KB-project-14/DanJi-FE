<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

/**
 * DanjiChip 컴포넌트
 *
 * 텍스트와 함께 사용할 수 있는 Chip 스타일 버튼입니다.
 * `ChevronDown` 아이콘을 함께 표시할 수 있으며, 클릭 이벤트를 제공합니다.
 *
 * @example 기본 사용
 * ```vue
 * <danji-chip>카테고리</danji-chip>
 * ```
 *
 * @example 아이콘 포함
 * ```vue
 * <danji-chip :isIcon="true">더보기</danji-chip>
 * ```
 */

const props = defineProps<{
  /**
   * ChevronDown 아이콘을 표시할지 여부
   * @default false
   */
  isIcon?: boolean
}>()

const emit = defineEmits<{
  /**
   * 버튼 클릭 이벤트
   *
   * @param event 마우스 클릭 이벤트 객체
   */
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button class="chip-danji Body00" @click="$emit('click', $event)">
    <slot></slot>
    <chevron-down v-if="isIcon" :size="20" :stroke-width="1" class="ms-1" />
  </button>
</template>
