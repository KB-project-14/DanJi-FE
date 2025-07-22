<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import UserCard from './components/common/card/UserCard.vue'
</script>

<template>
  <RouterView />
  <UserCard :balance="45000" backgroundImageUrl="/src/assets/images/gangseo-card.png" />
</template>

<style scoped></style>
