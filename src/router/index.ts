import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import PayPage from '@/views/pay/PayPage.vue'
import QRPage from '@/views/qr/QRPage.vue'
import PayCompletePage from '@/views/pay/PayCompletePage.vue'
import CashPayFailModal from '@/components/common/modal/CashPayFailModal.vue'
import MypagePage from '@/views/mypage/MypagePage.vue'
import HomePage from '@/views/wallet/home/HomePage.vue'
import OrderChangePage from '@/views/wallet/change/OrderChangePage.vue'
import WalletPage from '@/views/wallet/home/WalletPage.vue'
import CardHistoryPage from '@/views/wallet/history/CardHistoryPage.vue'
import CardSettingPage from '@/views/wallet/history/CardSettingPage.vue'
import CardChargePage from '@/views/wallet/charge/CardChargePage.vue'
import ChargeCompletePage from '@/views/wallet/charge/ChargeCompletePage.vue'
import ExchangePage from '@/views/wallet/exchange/ExchangePage.vue'
import MapPage from '@/views/map/MapPage.vue'
import ExchangeCompletePage from '@/views/wallet/exchange/ExchangeCompletePage.vue'
import LoginPage from '@/views/auth/LoginPage.vue'
import SignUpPage from '@/views/auth/SignUpPage.vue'
import LocalCardCreateSelectLocalPage from '@/views/wallet/create/LocalCardCreateSelectLocalPage.vue'
import LocalCardCreateDetailPage from '@/views/wallet/create/LocalCardCreateDetailPage.vue'
import PaymentPin from '@/views/auth/PaymentPinPage.vue'
import LocalCardCreateSuccessPage from '@/views/wallet/create/LocalCardCreateSuccessPage.vue'
import { Component } from 'lucide-vue-next'

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
    component: LocalCardCreateSelectLocalPage,
  },
  {
    path: '/card/history/:id',
    name: 'CardHistory',
    component: CardHistoryPage,
    props: (route: RouteLocationNormalized) => ({
      id: Number(route.params.id),
      balance: Number(route.query.balance),
    }),
  },
  {
    path: '/card/charge/:id',
    component: CardChargePage,
  },
  {
    path: '/card/charge-complete',
    name: 'ChargeCompletePage',
    component: ChargeCompletePage,
  },
  {
    path: '/card/setting',
    component: CardSettingPage,
  },
  {
    path: '/card/exchange/:id',
    name: 'ExchangePage',
    component: ExchangePage,
    props: true,
  },
  {
    path: '/exchange/complete',
    name: 'ExchangeCompletePage',
    component: ExchangeCompletePage,
  },
  {
    path: '/wallet/card/create/:id',
    name: 'LocalCardCreateDetail',
    component: LocalCardCreateDetailPage,
  },
  {
    path: '/wallet/card/create/success',
    name: 'LocalCardCreateSuccess',
    component: LocalCardCreateSuccessPage,
  },
  {
    path: '/map',
    component: MapPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage,
  },
  { path: '/payment-pin', name: 'PaymentPin', component: PaymentPin },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
