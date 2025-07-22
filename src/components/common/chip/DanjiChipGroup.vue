<script setup lang="ts">
import { ref, watch } from 'vue'
import DanjiChip from './DanjiChip.vue'

/**
 * DanjiChipGroup 컴포넌트
 *
 * 여러 개의 칩 중 **하나만 선택할 수 있는 단일 선택형 칩 그룹** 컴포넌트입니다.
 * Chip 컴포넌트(`DanjiChip`)를 리스트로 렌더링하며,
 * 사용자가 하나를 선택하면 해당 값이 `modelValue`로 업데이트됩니다.
 *
 * 칩이 화면 가로를 넘을 경우 자동 줄바꿈되도록 Bootstrap의 flex-wrap을 활용합니다.
 *
 * @example 기본 사용
 * ```vue
 * <danji-chip-group
 *   :options="['강원도', '경상도', '충청도', '전라도'']"
 *   v-model="selectedCategory"
 * />
 * ```
 *
 * @prop options - 표시할 칩 목록 (string 배열)
 * @prop modelValue - 현재 선택된 값 (v-model 양방향 바인딩)
 */

const props = defineProps<{
  options: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selected = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    selected.value = val
  },
)

function select(option: string) {
  if (selected.value === option) return
  selected.value = option
  emit('update:modelValue', option)
}

function isSelected(option: string) {
  return selected.value === option
}
</script>

<template>
  <div class="flex flex-wrap gap-[1rem]">
    <danji-chip
      v-for="option in options"
      :key="option"
      :is-active="isSelected(option)"
      @click="select(option)"
    >
      {{ option }}
    </danji-chip>
  </div>
</template>
