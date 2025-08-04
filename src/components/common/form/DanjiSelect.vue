<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import DanjiSelectDropdown from './DanjiSelectDropdown.vue'

/**
 * DanjiSelect - 기본 드롭다운 셀렉트 컴포넌트
 *
 * 문자열 배열(`string[]`)을 옵션으로 받아 간단한 드롭다운 UI를 제공합니다.
 * 외부 클릭 시 드롭다운이 자동으로 닫히며, 선택된 값은 `v-model`을 통해 양방향 바인딩됩니다.
 *
 * @component
 *
 * @example 기본 사용법
 * ```vue
 * <danji-select
 *   v-model="selectedRegion"
 *   label="지역 선택"
 *   :options="['서울', '부산', '대전']"
 * />
 * ```
 *
 * @example 비활성화된 셀렉트
 * ```vue
 * <danji-select
 *   v-model="selectedCity"
 *   :options="cityOptions"
 *   :disabled="!selectedRegion"
 * />
 * ```
 *
 * @prop modelValue - 현재 선택된 값입니다. v-model을 통해 부모 컴포넌트와 바인딩됩니다.
 * @prop label - (선택) 셀렉트 박스 상단에 표시할 라벨 텍스트입니다.
 * @prop options - 드롭다운에 표시할 항목 리스트입니다. 단순 문자열 배열로 구성됩니다.
 * @prop disabled - (선택) 셀렉트 박스 비활성화 여부입니다.
 *
 * @event update:modelValue - 항목 선택 시 발생하며, 선택된 문자열 값을 전달합니다.
 */

const props = defineProps<{
  modelValue: string
  label?: string
  options: string[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLDivElement>()

const selectedOption = computed(() => props.options.find((option) => option === props.modelValue))

const displayText = computed(() => (selectedOption.value ? selectedOption.value : '선택해주세요'))

const selectClass = computed(() => {
  const base =
    'w-full px-[1.4rem] py-[1.1rem] border-[2px] rounded-[1.2rem] bg-White-0 Body00 transition-all duration-200'
  const normal = 'border-Gray-1 text-Black-1 cursor-pointer'
  const open = 'border-Gray-3 shadow-sm cursor-pointer'
  const disabled = 'border-Gray-1 text-Gray-2 cursor-not-allowed'
  const placeholder = !selectedOption.value ? 'text-Gray-2' : ''

  if (props.disabled) return `${base} ${disabled}`
  if (isOpen.value) return `${base} ${open} ${placeholder}`
  return `${base} ${normal} ${placeholder}`
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const handleSelect = (value: string) => {
  if (props.disabled) return
  emit('update:modelValue', value)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="w-full" ref="selectRef">
    <!-- 라벨 -->
    <label v-if="label" class="block mb-[0.4rem] text-Black-1 Head02">
      {{ label }}
    </label>

    <!-- 셀렉트 박스 -->
    <div class="relative">
      <!-- 선택 영역 -->
      <div :class="selectClass" class="flex" @click="toggleDropdown">
        {{ displayText }}
        <ChevronDown
          :size="20"
          :stroke-width="1.5"
          :class="[
            isOpen && !disabled ? 'rotate-180' : 'rotate-0',
            disabled ? 'text-Gray-3' : 'text-Gray-5',
          ]"
          class="transition-all duration-200 ml-auto"
        />
      </div>

      <!-- 드롭다운 영역 (분리된 컴포넌트) -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <danji-select-dropdown
          v-if="isOpen && !disabled"
          :modelValue="modelValue"
          :options="options"
          @select="handleSelect"
        />
      </Transition>
    </div>
  </div>
</template>
