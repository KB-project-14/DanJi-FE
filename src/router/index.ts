import PayPage from '@/components/pay/PayPage.vue'
import QRPage from '@/components/pay/QRPage.vue'
import PayCompletePage from '@/components/pay/PayCompletePage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import PayModal from '@/components/common/modal/PayModal.vue'

const routes = [
  {
    path: '/',
    component: PayModal,
  },
  {
    path: '/pay',
    component: PayPage,
  },
  {
    path: '/pay-complete',
    component: PayCompletePage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
