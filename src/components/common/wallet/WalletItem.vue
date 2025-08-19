<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    name: string | null
    balance: number
    bgColorClass: string
    showMenu?: boolean
  }>(),
  {
    showMenu: false,
  },
)

const emit = defineEmits<{
  (e: 'toggle-drag'): void
}>()
</script>

<template>
  <div
    class="flex items-center justify-between px-[1.5rem] py-[1.4rem] rounded-xl shadow-sm"
    :class="props.bgColorClass"
  >
    <div class="Body00 text-Black2">{{ props.name }}</div>

    <div class="flex items-center gap-2 text-Black2">
      <div class="Body00">{{ (props.balance ?? 0).toLocaleString() }}원</div>
      <Menu
        v-if="props.showMenu"
        class="drag-handle cursor-grab w-[2rem] h-[2rem]"
        @click.stop="emit('toggle-drag')"
      />
    </div>
  </div>
</template>
