import Layout from '@/components/layout/Layout.vue'
import HomePage from '@/views/wallet/home/HomePage.vue'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Layout,
    props: {
      headerType: 'main',
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
