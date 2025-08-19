<script setup lang="ts">
import { XCircle } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'right-click'): void
}>()

const onRightClick = () => {
  emit('right-click')
}
</script>
<template>
  <div class="flex items-center bg-white px-3 h-[7.2rem]">
    <div class="Head0 flex-1 pl-3">단지Pay</div>

    <div class="cursor-pointer" @click="onRightClick">
      <XCircle :size="24" class="text-Gray-5" />
    </div>
  </div>
</template>
