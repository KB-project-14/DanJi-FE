<script setup lang="ts">
import { useRoute } from 'vue-router'
import BottomNavItem from './BottomNavItem.vue'

const route = useRoute()

const ITEMS = [
  { text: '지갑', path: '/' },
  { text: '지도', path: '/map' },
  { text: 'QR', path: '/qr' },
  { text: '뱃지', path: '/badge' },
  { text: '마이', path: '/mypage' },
]

const getActiveItem = (path: string) => {
  return route.path === path
}
</script>

<template>
  <section class="flex h-[9rem] justify-between items-center px-[0.75rem] bg-White-0">
    <BottomNavItem
      v-for="item in ITEMS"
      :key="item.text"
      :text="item.text"
      :isActive="getActiveItem(item.path)"
    />
  </section>
</template>
