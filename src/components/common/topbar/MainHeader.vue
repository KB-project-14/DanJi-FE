<script setup lang="ts">
// 추후 홈 화면으로 이동 처리 예정
defineEmits(['left-click'])
</script>

<template>
  <div class="main-header">
    <!-- 왼쪽 로고 -->
    <div class="main-header-logo" @click="$emit('left-click')">
      <img src="@/assets/images/danji-logo-main.png" alt="단지 로고" />
    </div>
  </div>
</template>

<style scoped>
.main-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  padding: 1rem 1rem 0 1rem;
  width: 100%;
  height: 4.5rem;
}

.main-header-logo {
  padding-left: 1rem;
  cursor: pointer;
}

.main-header-logo img {
  height: 3rem;
}
</style>
