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
    class="flex items-center justify-between px-[1.5rem] py-[1.4rem] rounded-xl shadow-sm"
    :class="bgColorClass"
  >
    <!-- 지역화폐카드 이름 -->
    <div class="Body00 text-Black2">{{ name }}</div>

    <!-- 지역화폐카드 잔액 -->
    <div class="Head02 text-Black2">잔액 {{ balance.toLocaleString() }}원</div>

    <!-- 햄버거 (순서변경) -->
    <div class="text-Black2 w-[4rem] flex justify-end">
      <Menu
        v-if="showMenu"
        class="drag-handle cursor-grab w-[2rem] h-[2rem]"
        @click.stop="emit('toggle-drag')"
      />
    </div>
  </div>
</template>
