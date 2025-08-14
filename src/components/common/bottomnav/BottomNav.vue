<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BottomNavItem from './BottomNavItem.vue'
import LoginRequiredModal from '@/components/common/modal/LoginRequiredModal.vue'
import { isGuest } from '@/utils/auth'

const route = useRoute()
const router = useRouter()

const guestAllowed = new Set<string>(['/map'])
const ITEMS = [
  { text: '지갑', path: '/home' },
  { text: '지도', path: '/map' },
  { text: 'QR', path: '/qr' },
  { text: '뱃지', path: '/badge' },
  { text: '마이', path: '/mypage' },
]

const getActiveItem = (path: string) => route.path === path

const showLoginModal = ref(false)
const pendingPath = ref<string | null>(null)

function onNavClick(path: string) {
  if (isGuest() && !guestAllowed.has(path)) {
    pendingPath.value = path
    showLoginModal.value = true
    return
  }
  router.push(path)
}

function closeModal() {
  showLoginModal.value = false
  pendingPath.value = null
}

function goLogin() {
  showLoginModal.value = false
  pendingPath.value = null
  router.push({ path: '/login', query: { redirect: '/home' } })
}
</script>

<template>
  <section class="flex h-[9rem] justify-between items-center px-[0.75rem] bg-White-0">
    <BottomNavItem
      v-for="item in ITEMS"
      :key="item.text"
      :text="item.text"
      :isActive="getActiveItem(item.path)"
      @click="onNavClick(item.path)"
    />
  </section>

  <LoginRequiredModal v-if="showLoginModal" @close="closeModal" @go-login="goLogin" />
</template>
