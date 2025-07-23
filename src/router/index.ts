import PayPage from '@/views/pay/PayPage.vue'
import QRPage from '@/views/qr/QRPage.vue'
import PayCompletePage from '@/views/pay/PayCompletePage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import PayModal from '@/components/common/modal/LocalPayFailModal.vue'
import CashPayFailModal from '@/components/common/modal/CashPayFailModal.vue'
import MypagePage from '@/views/mypage/MypagePage.vue'

const routes = [
  {
    path: '/',
    component: CashPayFailModal,
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
    path: '/mypage',
    component: MypagePage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
