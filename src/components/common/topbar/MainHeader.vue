<script setup lang="ts">
// 추후 홈 화면으로 이동 처리 예정
defineEmits(['left-click'])
</script>

<template>
  <div class="flex items-center justify-start w-full h-[7.2rem] pt-4 pb-4 px-4 bg-white">
    <!-- 왼쪽 로고 -->
    <div class="pl-4 cursor-pointer" @click="$emit('left-click')">
      <img src="@/assets/images/danji-logo-main.png" alt="단지 로고" class="h-14" />
    </div>
  </div>
</template>
