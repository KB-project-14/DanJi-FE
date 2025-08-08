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
 * <danji-chip :is-icon="true">더보기</danji-chip>
 * ```
 *
 * @prop isIcon - ChevronDown 아이콘 표시 여부
 * @prop isActive - 버튼이 활성화 상태인지 여부
 */

const props = defineProps<{
  isIcon?: boolean
  isActive?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    @click="$emit('click', $event)"
    class="inline-flex items-center justify-center rounded-full border-2 px-[1.8rem] py-[0.4rem] Body00"
    :class="[
      props.isActive
        ? 'bg-Yellow-0 text-White-0 border-Yellow-0'
        : 'bg-White-1 text-Gray-7 border-Gray-1',
      'hover:bg-Yellow-0 hover:text-White-0 hover:border-Yellow-0',
      'focus:bg-Yellow-0 focus:text-White-0 focus:border-Yellow-0',
      'active:bg-Yellow-0 active:text-White-0 active:border-Yellow-0',
    ]"
  >
    <slot></slot>
    <ChevronDown v-if="props.isIcon" :size="20" :stroke-width="1" class="ms-1" />
  </button>
</template>
