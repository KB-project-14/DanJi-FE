<script setup lang="ts">
import { XCircle } from 'lucide-vue-next'

const emits = defineEmits<{
  (e: 'right-click'): void
}>()

const onRightClick = () => emits('right-click')
</script>
<template>
  <div class="flex items-center bg-white px-3 h-[7.2rem]">
    <!-- 왼쪽 텍스트 -->
    <div class="Head0 flex-1 pl-3">단지Pay</div>

    <!-- 오른쪽 닫기 아이콘 -->
    <div class="cursor-pointer" @click="$emit('right-click')">
      <XCircle :size="24" class="text-Gray-5" />
    </div>
  </div>
</template>
