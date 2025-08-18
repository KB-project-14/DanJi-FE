<script setup lang="ts">
import { computed } from 'vue'

/**
 * CategoryChip 컴포넌트
 *
 * 지역 가맹점 카테고리를 표시하는 디자인용 칩 컴포넌트입니다.
 * 각 카테고리마다 고유한 색상이 자동으로 할당됩니다.
 *
 * @example 기본 사용법
 * ```vue
 * <local-store-filter-chip category="카페" />
 * ```
 *
 * @prop category - 표시할 카테고리 이름
 */

const props = defineProps<{
  /**
   * 카테고리 이름
   */
  category: string
}>()

const getCategoryColor = (category: string): string => {
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    const char = category.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash >>> 0
  }

  const colorCombinations = [
    { bg: 'bg-red-100', text: 'text-red-700' },
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-green-100', text: 'text-green-700' },
    { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    { bg: 'bg-purple-100', text: 'text-purple-700' },
    { bg: 'bg-pink-100', text: 'text-pink-700' },
    { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    { bg: 'bg-teal-100', text: 'text-teal-700' },
    { bg: 'bg-orange-100', text: 'text-orange-700' },
    { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { bg: 'bg-rose-100', text: 'text-rose-700' },
    { bg: 'bg-violet-100', text: 'text-violet-700' },
    { bg: 'bg-lime-100', text: 'text-lime-700' },
    { bg: 'bg-amber-100', text: 'text-amber-700' },
  ]

  const colorIndex = Math.abs(hash) % colorCombinations.length
  const colors = colorCombinations[colorIndex]

  return `${colors.bg} ${colors.text}`
}

const chipClass = computed(() => {
  const baseClass =
    'inline-flex items-center justify-center px-[1.5rem] py-[0.2rem] rounded-full Body03'
  const colorClass = getCategoryColor(props.category)

  return `${baseClass} ${colorClass}`
})
</script>

<template>
  <span :class="chipClass">
    {{ category }}
  </span>
</template>
