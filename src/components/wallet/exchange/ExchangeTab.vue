<script setup lang="ts">
const props = defineProps<{
  tabs: string[]
  activeIndex: number
}>()

const emit = defineEmits<{
  (e: 'change', index: number): void
}>()

const handleTabClick = (index: number) => {
  emit('change', index)
}
</script>

<template>
  <div class="flex bg-White-1 rounded-lg shadow-sm">
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      @click="handleTabClick(index)"
      class="flex-1 py-[1.8rem] text-center Body01"
      :class="
        activeIndex === index ? 'text-Yellow-1 border-b-2 border-Yellow-1 Body00' : 'text-Gray-5'
      "
    >
      {{ tab }}
    </button>
  </div>
</template>
