<script setup lang="ts">
import { computed } from 'vue'

/**
 * DanjiButton 컴포넌트
 *
 * 다양한 버튼 스타일(`variant`)을 지원하는 범용 버튼 컴포넌트입니다.
 * 클릭 이벤트 및 비활성화 처리를 지원합니다.
 *
 * @example 기본 사용
 * ```vue
 * <danji-button variant="medium">확인</danji-button>
 * ```
 *
 * @example 클릭 이벤트 처리
 * ```vue
 * <danji-button @click="handleClick">저장</danji-button>
 * ```
 *
 * @example 비활성화 버튼
 * ```vue
 * <danji-button variant="large" :disabled="true">비활성</danji-button>
 * ```
 *
 * @prop variant - 버튼 스타일 종류 (`large`, `medium`, `small`, `rounded`, `smallOutline`, `roundedOutline`)
 * @prop disabled - 버튼 비활성화 여부
 * @event click - 버튼 클릭 시 이벤트 발생
 */

const props = defineProps<{
  /**
   * 버튼 스타일 타입
   * @default 'medium'
   */
  variant?: 'large' | 'medium' | 'small' | 'rounded' | 'smallOutline' | 'roundedOutline'

  /**
   * 버튼 비활성화 여부
   */
  disabled?: boolean
}>()

const emit = defineEmits<{
  /**
   * 버튼 클릭 이벤트
   * @param event 마우스 클릭 이벤트
   */
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => {
  const baseStyle =
    'inline-flex items-center justify-center disabled:cursor-not-allowed disabled:bg-Gray-3 disabled:text-White-0 disabled:border-Gray-3'

  const variants = {
    large: 'py-[1.4rem] px-[14.4rem] rounded-[1.2rem] bg-Brown-3 text-White-0 Head02',
    medium: 'py-[1.4rem] px-[6.4rem] rounded-[1.2rem] bg-Brown-3 text-White-0 Head02',
    small:
      'py-[0.7rem] px-[4.7rem] rounded-[1rem] bg-Brown-3 text-White-0 border-2 border-Brown-3 Head03',
    rounded:
      'py-[0.8rem] px-[4.8rem] rounded-[2.5rem] bg-Brown-3 text-White-0 border-2 border-Brown-3 Head04',
    smallOutline:
      'py-[0.7rem] px-[4.7rem] rounded-[1rem] bg-White-1 text-Gray-7  border-2  border-Gray-1 Head03',
    roundedOutline:
      'py-[0.8rem] px-[4.8rem] rounded-[2.5rem]  bg-White-1 text-Gray-7 border-2 border-Gray-1 Head04',
  }

  const variant = props.variant || 'medium'
  return `${baseStyle} ${variants[variant]}`
})
</script>

<template>
  <button :class="buttonClass" :disabled="disabled || false" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>
