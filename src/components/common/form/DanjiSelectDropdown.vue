<script setup lang="ts">
/**
 * DanjiDropdownOptions - 드롭다운 옵션 리스트 컴포넌트
 *
 * DanjiSelect와 같은 셀렉트 컴포넌트의 드롭다운 옵션 영역을 별도 분리한 컴포넌트입니다.
 * `options` 배열을 받아 옵션 목록을 렌더링하며, 클릭 시 `select` 이벤트로 선택한 값을 상위 컴포넌트에 전달합니다.
 *
 * @component
 *
 * @example 기본 사용법
 * ```vue
 * <danji-select-dropdown
 *   :model-value="selectedOption"
 *   :options="['서울', '부산', '대전']"
 *   @select="handleSelect"
 * />
 * ```
 *
 * @prop modelValue - 현재 선택된 옵션 문자열
 * @prop options - 표시할 옵션 문자열 배열
 *
 * @event select - 옵션을 클릭하면 발생하며, 선택된 문자열 값을 전달합니다.
 * ```ts
 * (value: string) => void
 * ```
 *
 * @remarks
 * - 선택된 항목은 회색 배경(`bg-Gray-3`) 및 흰색 텍스트로 강조됩니다.
 * - 첫 번째/마지막 항목은 둥근 모서리를 적용해 시각적 구분을 줍니다.
 * - 드롭다운 컨테이너는 고정 위치(`absolute`)이며, 부모 컴포넌트에서 위치를 제어해야 합니다.
 */

const props = defineProps<{
  modelValue: string
  options: string[]
}>()

const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

const handleSelect = (value: string) => {
  emit('select', value)
}
</script>

<template>
  <div
    class="absolute z-50 w-full mt-[0.4rem] bg-White-0 border-[2px] border-Gray-1 rounded-[1.2rem] shadow-lg overflow-hidden"
  >
    <div class="max-h-[20rem] overflow-y-auto">
      <div
        v-for="(option, index) in options"
        :key="option"
        class="px-[1.4rem] py-[1.1rem] Body00 cursor-pointer transition-all duration-150 hover:bg-Gray-1 active:bg-Gray-2"
        :class="[
          option === modelValue ? 'bg-Gray-3 text-White-1' : 'text-Black-1',
          index === 0 ? 'rounded-t-[1rem]' : '',
          index === options.length - 1 ? 'rounded-b-[1rem]' : '',
        ]"
        @click="handleSelect(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>
