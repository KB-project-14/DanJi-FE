<script setup lang="ts">
import BottomNavItem from './BottomNavItem.vue'
import { ref } from 'vue'

const ITEMS = ['지갑', '지도', 'QR', '뱃지', '마이']

const activeItem = ref('지갑')
const setActive = (item: string) => {
  activeItem.value = item
}
</script>

<template>
  <section class="bottomNavWrapper">
    <BottomNavItem
      v-for="(text, _) in ITEMS"
      :key="text"
      :text="text"
      :isActive="activeItem === text"
      @click="setActive(text)"
    />
  </section>
</template>

<style scoped>
.bottomNavWrapper {
  display: flex;
  height: 9rem;

  justify-content: space-between;
  align-items: center;

  background: var(--White00);
}
</style>
