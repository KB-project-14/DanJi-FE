<script setup lang="ts">
defineEmits(['left-click'])
</script>

<template>
  <div
    class="d-flex align-items-center justify-content-start bg-white px-3 pt-3 w-100"
    style="height: 4.5rem"
  >
    <!-- 왼쪽 로고 -->
    <div style="cursor: pointer" @click="$emit('left-click')" class="ps-4">
      <img src="@/assets/images/danji-logo-main.png" alt="단지 로고" style="height: 2.5rem" />
    </div>
  </div>
</template>
