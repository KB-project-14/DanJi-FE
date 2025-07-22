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
  <section class="flex h-[9rem] justify-between items-center px-[0.75rem] bg-White-0">
    <BottomNavItem
      v-for="(text, _) in ITEMS"
      :key="text"
      :text="text"
      :isActive="activeItem === text"
      @click="setActive(text)"
    />
  </section>
</template>
