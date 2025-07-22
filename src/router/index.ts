import Layout from '@/components/layout/Layout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Layout,
    props: {
      headerType: 'basic',
      headerTitle: 'Home',
      showLeftIcon: true,
      isBottomNav: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
