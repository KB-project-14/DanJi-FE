import PayPage from '@/views/pay/PayPage.vue'
import QRPage from '@/views/qr/QRPage.vue'
import PayCompletePage from '@/views/pay/PayCompletePage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import PayModal from '@/components/common/modal/LocalPayFailModal.vue'
import CashPayFailModal from '@/components/common/modal/CashPayFailModal.vue'
import MypagePage from '@/views/mypage/MypagePage.vue'
import HomePage from '@/views/wallet/home/HomePage.vue'
import OrderChange from '@/views/wallet/change/OrderChange.vue'
import WalletView from '@/views/wallet/home/WalletView.vue'
import CardHistoryView from '@/views/wallet/history/CardHistoryView.vue'

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
    path: '/mypage',
    component: MypagePage,
  },
  {
    path: '/order',
    component: OrderChange,
  },
  {
    path: '/wallet/view',
    component: WalletView,
  },
  {
    path: '/card/history',
    component: CardHistoryView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
