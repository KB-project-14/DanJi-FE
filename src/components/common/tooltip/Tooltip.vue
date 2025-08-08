<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { HelpCircle } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    message: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
  }>(),
  {
    position: 'top',
    align: 'center',
  },
)
// 사용법
// 1. 아래쪽/왼쪽 중앙
// <Tooltip message="원하는 메세지 적기" position="bottom" align="center" />
// <Tooltip message="" position="left" align="center" />

// 2. 왼/오른쪽 상단
// <Tooltip message="" position="top" align="start" />
// <Tooltip message="" position="top" align="end" />

// 3. 오른쪽 하단
// <Tooltip message="" position="right" align="end" />

const showTooltip = ref(false)
const tooltipRef = ref<HTMLElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (
    tooltipRef.value &&
    !tooltipRef.value.contains(target) &&
    iconRef.value &&
    !iconRef.value.contains(target)
  ) {
    showTooltip.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// 위치별 계산
const tooltipPositionClass = computed(() => {
  const pos = props.position || 'top'
  const align = props.align || 'center'

  const base: Record<string, string> = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  }

  const alignClass: Record<string, string> = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }

  return `${base[pos]} ${alignClass[align]}`
})
</script>

<template>
  <div class="relative flex items-center">
    <HelpCircle
      ref="iconRef"
      class="w-[1.6rem] h-[1.6rem] text-Gray-5 cursor-pointer"
      role="button"
      :aria-label="`도움말: ${message}`"
      :aria-expanded="showTooltip"
      tabindex="0"
      @click.stop="showTooltip = !showTooltip"
      @keydown.enter.space.stop="showTooltip = !showTooltip"
    />
    <div
      v-if="showTooltip"
      ref="tooltipRef"
      role="tooltip"
      :aria-hidden="!showTooltip"
      :class="`absolute z-50 p-[0.8rem] rounded-md shadow bg-Black-2 text-White-0 Body04 whitespace-nowrap ${tooltipPositionClass}`"
    >
      {{ message }}
    </div>
  </div>
</template>
