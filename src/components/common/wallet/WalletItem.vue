<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

defineProps<{
  name: string
  balance: number
  bgColorClass?: string
  showMenu?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-drag'): void
}>()
</script>

<template>
  <div
    class="flex items-center justify-between px-6 py-5 rounded-xl shadow-sm"
    :class="bgColorClass"
  >
    <!-- 이름 -->
    <div class="Body00 text-Black2">{{ name }}</div>

    <!-- 잔액 -->
    <div class="Head02 text-Black2">잔액 {{ balance.toLocaleString() }}원</div>

    <!-- 햄버거 (순서변경) -->
    <div class="text-Black2 w-[20px] flex justify-end">
      <Menu
        v-if="showMenu"
        :size="20"
        class="drag-handle cursor-grab"
        @click.stop="emit('toggle-drag')"
      />
    </div>
  </div>
</template>
