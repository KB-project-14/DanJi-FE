import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useKakao } from 'vue3-kakao-maps/@utils'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from '@/api/queryClient'

import './assets/styles/reset.css'
import './assets/styles/tailwind.css'
import './assets/styles/main.css'

import App from './App.vue'
import router from './router'

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser.test')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

useKakao(import.meta.env.VITE_KAKAO_APP_API_KEY)
const app = createApp(App)

app.use(VueQueryPlugin, {
  queryClient,
  enableDevtoolsV6Plugin: true, // Vue DevTools 지원
})
app.use(createPinia())
app.use(router)

app.mount('#app')
