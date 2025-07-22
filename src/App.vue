<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import MainHeader from './components/common/topbar/MainHeader.vue'
import Header from './components/common/topbar/Header.vue'
import PayHeader from './components/common/topbar/PayHeader.vue'
</script>

<template>
  <RouterView />
  <MainHeader />
  <Header
    title="테스트 제목"
    :showLeftIcon="true"
    :showRightIcon="true"
    @left-click="onLeft"
    @right-click="onRight"
  />
  <PayHeader />
</template>

<style scoped></style>
