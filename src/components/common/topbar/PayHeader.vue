<script setup lang="ts">
import { XCircle } from 'lucide-vue-next'
</script>

<template>
  <div class="d-flex align-items-center bg-white px-3" style="height: 4rem">
    <!-- 왼쪽 텍스트 -->
    <div class="flex-grow-1" style="font-size: 1rem">단지Pay</div>

    <!-- 오른쪽 닫기 아이콘 -->
    <div style="cursor: pointer" @click="$emit('right-click')">
      <XCircle :size="24" style="color: var(--Gray05)" />
    </div>
  </div>
</template>
