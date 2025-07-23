import PayPage from '@/views/pay/PayPage.vue'
import QRPage from '@/views/qr/QRPage.vue'
import PayCompletePage from '@/views/pay/PayCompletePage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import PayModal from '@/components/common/modal/LocalPayFailModal.vue'
import CashPayFailModal from '@/components/common/modal/CashPayFailModal.vue'
import HomePage from '@/views/wallet/home/HomePage.vue'
import OrderChange from '@/views/wallet/change/OrderChange.vue'

const routes = [
  {
    path: '/',
    component: CashPayFailModal,
  },
  {
    path: '/home',
    component: HomePage,
  },
  {
    path: '/pay',
    component: PayPage,
  },
  {
    path: '/pay-complete',
    component: PayCompletePage,
  },
  {
    path: '/order',
    component: OrderChange,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
