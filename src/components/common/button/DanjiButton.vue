<script setup lang="ts">
import { computed } from 'vue'

/**
 * DanjiButton 컴포넌트
 *
 * 다양한 버튼 형태(`variant`)를 지원하며,
 * 사용자 지정 텍스트와 클릭 이벤트 처리를 위한 슬롯 기반 커스텀 버튼입니다.
 *
 * @example 기본 사용
 * ```vue
 * <danji-button variant="large">확인</danji-button>
 * ```
 *
 * @example 클릭 이벤트 처리
 * ```vue
 * <danji-button @click="handleClick">저장</danji-button>
 * ```
 *
 * @example 비활성화 처리
 * ```vue
 * <danji-button variant="roundedOutline" :disabled="true">비활성</danji-button>
 * ```
 */

const props = defineProps<{
  /**
   * 버튼의 스타일 변형 옵션
   *
   * - `large`: 큰 사이즈
   * - `medium`: 기본 사이즈 (기본값)
   * - `small`: 작은 사이즈
   * - `rounded`: 둥근 스타일
   * - `smallOutline`: 작은 외곽선 스타일
   * - `roundedOutline`: 둥근 외곽선 스타일
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
   *
   * @param event 마우스 클릭 이벤트 객체
   */
  click: [event: MouseEvent]
}>()

/**
 * variant에 따라 버튼 스타일 클래스 설정
 */
const buttonClass = computed(() => {
  const configs = {
    large: { base: 'btn-danji-large', font: 'Head02' },
    medium: { base: 'btn-danji-medium', font: 'Head02' },
    small: { base: 'btn-danji-small', font: 'Head03' },
    rounded: { base: 'btn-danji-rounded', font: 'Head04' },
    smallOutline: { base: 'btn-danji-small btn-danji-outline', font: 'Head03' },
    roundedOutline: { base: 'btn-danji-rounded btn-danji-outline', font: 'Head04' },
  }

  const config = configs[props.variant || 'medium']
  return `${config.base} ${config.font}`
})
</script>

<template>
  <button :class="buttonClass" :disabled="disabled || false" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>
