import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useKakao } from 'vue3-kakao-maps/@utils'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from '@/api/queryClient'

import 'vue3-toastify/dist/index.css'
import Vue3Toastify, { toast } from 'vue3-toastify'
import { useUiStore } from '@/stores/useUiStore'

import './assets/styles/reset.css'
import './assets/styles/tailwind.css'
import './assets/styles/main.css'

import App from './App.vue'
import router from './router'

// if (import.meta.env.DEV) {
//   const { worker } = await import('./mocks/browser.test')
//   await worker.start({ onUnhandledRequest: 'bypass' })
// }

useKakao(import.meta.env.VITE_KAKAO_APP_API_KEY, ['clusterer'])
const app = createApp(App)
const pinia = createPinia()

app.use(VueQueryPlugin, {
  queryClient,
  enableDevtoolsV6Plugin: true, // Vue DevTools 지원
})
app.use(createPinia())
app.use(pinia)

app.use(router)

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: toast.POSITION.TOP_RIGHT,
  newestOnTop: true,
})

// 라우팅 끝난 뒤 예약된 토스트 표시 (Pinia 인스턴스 넘겨서 사용)
router.afterEach(() => {
  const ui = useUiStore(pinia)
  const t = ui.popNextToast()
  if (t) toast[t.type](t.msg, t.opts)
})

app.mount('#app')
