<script setup lang="ts">
import '@/assets/styles/main.css'
import { XCircle } from 'lucide-vue-next'
</script>

<template>
  <div class="d-flex align-items-center bg-white px-3" style="height: 4rem">
    <!-- 왼쪽 텍스트 -->
    <div class="Head01 flex-grow-1 ps-3">단지Pay</div>

    <!-- 오른쪽 닫기 아이콘 -->
    <div class="cursor-pointer" @click="$emit('right-click')">
      <XCircle :size="24" class="text-secondary" />
    </div>
  </div>
</template>
