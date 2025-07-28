<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { HelpCircle } from 'lucide-vue-next'

const props = defineProps<{
  message: string // 툴팁 텍스트
}>()

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
</script>

<template>
  <div class="relative flex items-center">
    <!-- lucide HelpCircle 아이콘 -->
    <HelpCircle
      ref="iconRef"
      class="w-[1.6rem] h-[1.6rem] text-Gray-5 cursor-pointer"
      @click.stop="showTooltip = !showTooltip"
    />

    <!-- 툴팁 -->
    <div
      v-if="showTooltip"
      ref="tooltipRef"
      class="absolute rounded-md shadow z-50 top-full right-0 mt-[0.5rem] p-[1rem] w-max bg-Black-2 text-White-0 Body04"
    >
      {{ message }}
    </div>
  </div>
</template>
