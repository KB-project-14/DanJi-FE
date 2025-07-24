<script setup lang="ts">
import { computed } from 'vue'

/**
 * DanjiInput - 입력 필드 컴포넌트
 *
 * 텍스트, 이메일, 숫자 등 다양한 입력 타입을 지원하며, placeholder와 정렬 방향, 아이콘 삽입 등 유연한 설정이 가능한 입력 컴포넌트입니다.
 * 외부에서 `v-model`로 값을 바인딩하고, focus 이벤트를 받아 처리할 수 있습니다.
 * 아이콘이 필요한 경우 `icon` 슬롯을 통해 삽입할 수 있으며, 자동으로 input 왼쪽에 정렬됩니다.
 *
 * @component
 *
 * @example 기본 사용법
 * ```vue
 * <danji-input
 *   v-model="name"
 *   placeholder="이름을 입력하세요"
 * />
 * ```
 *
 * @example 아이콘 삽입
 * ```vue
 * <danji-input
 *   v-model="email"
 *   placeholder="이메일 주소"
 * >
 *   <template #icon>
 *     <mail-icon />
 *   </template>
 * </danji-input>
 * ```
 *
 * @prop modelValue - 입력 필드의 값. `v-model`을 통해 양방향 바인딩됩니다.
 * @prop placeholder - 입력 필드에 표시될 안내 문구입니다.
 * @prop textAlign - 입력 텍스트 정렬 방식입니다. `'left' | 'center' | 'right'` 중 하나를 선택합니다.
 * @prop disabled - 입력 비활성화 여부를 설정합니다.
 * @prop type - 입력 타입입니다. `'text'`, `'password'`, `'email'`, `'number'` 중 하나입니다. 기본값은 `'text'`입니다.
 *
 * @event update:modelValue - 입력 내용이 변경될 때 발생합니다. 새로운 값이 인자로 전달됩니다.
 * @event focus - 입력창이 포커스를 받을 때 발생합니다. `FocusEvent`가 전달됩니다.
 *
 * @slot icon - 입력 필드 왼쪽에 표시될 아이콘 영역입니다.
 *
 */

const props = defineProps<{
  modelValue: string
  placeholder?: string
  textAlign?: 'left' | 'right' | 'center'
  disabled?: boolean
  type?: 'text' | 'password' | 'email' | 'number'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
}>()

const inputClass = computed(() => {
  const baseClass =
    'w-full px-[1.8rem] py-[1.1rem] border-[2px] border-Gray-1 rounded-[1.2rem] bg-White-0 ' +
    'placeholder:text-[1.4rem] placeholder:font-medium placeholder:leading-[1.5] placeholder:text-Gray-2 ' +
    'Head02 focus:outline-none focus:border-Gray-3 focus:ring-0 transition-colors'

  const alignClass = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  }[props.textAlign || 'left']

  const disabledClass = props.disabled ? 'cursor-not-allowed' : 'text-Black-2'

  return `${baseClass} ${alignClass} ${disabledClass}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<template>
  <div class="flex w-full items-center">
    <!-- 아이콘 영역 (아이콘이 있을 때만 표시됨) -->
    <div v-if="$slots.icon" class="mr-[0.8rem] flex items-center">
      <slot name="icon" />
    </div>

    <!-- 입력창 -->
    <input
      :value="modelValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClass"
      @input="handleInput"
      @focus="handleFocus"
      class="flex-1"
    />
  </div>
</template>
