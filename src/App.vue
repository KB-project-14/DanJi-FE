<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import PayHeader from './components/common/topbar/PayHeader.vue'

const onClose = () => {
  console.log('닫기 버튼 ')
}
</script>

<template>
  <RouterView />
  <PayHeader @right-click="onClose" />
</template>

<style scoped></style>
