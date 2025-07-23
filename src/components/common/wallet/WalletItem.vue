<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

defineProps<{
  name: string
  balance: number
  bgColorClass?: string
}>()
</script>
<template>
  <div
    class="flex items-center justify-between px-4 py-3 rounded-xl shadow-sm"
    :class="bgColorClass"
  >
    <!-- 지역화폐 이름 -->
    <div class="font-medium text-sm text-white">
      {{ name }}
    </div>

    <!-- 잔액 -->
    <div class="font-semibold text-sm text-white">잔액 {{ balance.toLocaleString() }}원</div>

    <!-- 햄버거 아이콘 -->
    <div class="text-white">
      <Menu :size="20" />
    </div>
  </div>
</template>
