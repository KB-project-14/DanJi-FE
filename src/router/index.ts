import Layout from '@/components/layout/Layout.vue'
import OrderChange from '@/views/wallet/change/OrderChange.vue'
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
    path: '/order',
    component: OrderChange,
    props: {
      headerType: 'basic',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
