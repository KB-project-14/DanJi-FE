import PayPage from '@/views/pay/PayPage.vue'
import QRPage from '@/views/qr/QRPage.vue'
import PayCompletePage from '@/views/pay/PayCompletePage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import PayModal from '@/components/common/modal/LocalPayFailModal.vue'
import CashPayFailModal from '@/components/common/modal/CashPayFailModal.vue'
import MypagePage from '@/views/mypage/MypagePage.vue'
import HomePage from '@/views/wallet/home/HomePage.vue'
import OrderChangePage from '@/views/wallet/change/OrderChangePage.vue'
import WalletPage from '@/views/wallet/home/WalletPage.vue'
import LocalCardCreatePage from '@/views/wallet/create/LocalCardCreatePage.vue'
import CardHistoryPage from '@/views/wallet/history/CardHistoryPage.vue'
import CardSettingPage from '@/views/wallet/history/CardSettingPage.vue'
import CardChargePage from '@/views/wallet/charge/CardChargePage.vue'
import ChargeCompletePage from '@/views/wallet/charge/ChargeCompletePage.vue'
import { Component } from 'lucide-vue-next'
import LocalCardCreateDetailPage from '@/views/wallet/create/LocalCardCreateDetailPage.vue'

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
    component: OrderChangePage,
  },
  {
    path: '/qr',
    component: QRPage,
  },
  {
    path: '/wallet/view',
    component: WalletPage,
  },
  {
    path: '/wallet/card/create',
    component: LocalCardCreatePage,
  },
  {
    path: '/card/history',
    component: CardHistoryPage,
  },
  {
    path: '/card/charge',
    component: CardChargePage,
  },
  {
    path: '/wallet/charge-complete',
    name: 'ChargeCompletePage',
  },
  {
    path: '/card/setting',
    component: CardSettingPage,
  },
  {
    path: '/wallet/card/create/:region/:city',
    name: 'LocalCardCreateDetail',
    component: LocalCardCreateDetailPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
