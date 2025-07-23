<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

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
 * @prop modelValue - 현재 선택된 값입니다. v-model을 통해 부모 컴포넌트와 바인딩됩니다.
 * @prop label - (선택) 셀렉트 박스 상단에 표시할 라벨 텍스트입니다.
 * @prop options - 드롭다운에 표시할 항목 리스트입니다. 단순 문자열 배열로 구성됩니다.
 *
 * @event update:modelValue - 항목 선택 시 발생하며, 선택된 문자열 값을 전달합니다.
 *
 * @remarks
 * - 선택된 항목이 없을 경우 '선택해주세요'라는 기본 안내 문구가 표시됩니다.
 */

const props = defineProps<{
  modelValue: string
  label?: string
  options: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLDivElement>()

const selectedOption = computed(() => {
  return props.options.find((option) => option === props.modelValue)
})

const displayText = computed(() => {
  if (selectedOption.value) {
    return selectedOption.value
  }
  return '선택해주세요'
})

const selectClass = computed(() => {
  const baseClass =
    'w-full px-[1.4rem] py-[1.1rem] border-[2px] rounded-[1.2rem] bg-White-0 Body00 cursor-pointer transition-all duration-200'
  const normalClass = 'border-Gray-1 text-Black-1'
  const openClass = 'border-Gray-3 shadow-sm'
  const placeholderClass = !selectedOption.value ? 'text-Gray-2' : ''

  if (isOpen.value) return `${baseClass} ${openClass} ${placeholderClass}`
  return `${baseClass} ${normalClass} ${placeholderClass}`
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: string) => {
  emit('update:modelValue', option)
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
    <!-- 셀렉트 박스 제목 -->
    <label v-if="label" class="block mb-[0.4rem] text-Black-1 Head02">
      {{ label }}
    </label>

    <!-- 셀렉트 박스 -->
    <div class="relative">
      <!-- 선택된 값 표시 영역 -->
      <div :class="selectClass" class="flex" @click="toggleDropdown">
        {{ displayText }}

        <ChevronDown
          :size="20"
          :stroke-width="1.5"
          :class="isOpen ? 'rotate-180' : 'rotate-0'"
          class="text-Gray-5 transition-all duration-200 ml-auto"
        />
      </div>

      <!-- 드롭다운 옵션들 -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isOpen"
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
              @click="selectOption(option)"
            >
              {{ option }}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
