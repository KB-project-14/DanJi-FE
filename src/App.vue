<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import UserCard from './components/common/card/UserCard.vue'
import NoCard from './components/common/card/NoCard.vue'
</script>

<template>
  <RouterView />
  <UserCard :balance="45000" backgroundImageUrl="/src/assets/images/gangseo-card.png" />
  <NoCard />
</template>

<style scoped></style>
