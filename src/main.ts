import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useKakao } from 'vue3-kakao-maps/@utils'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from '@/api/queryClient'

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
pinia.use(piniaPluginPersistedstate)

app.use(VueQueryPlugin, {
  queryClient,
  enableDevtoolsV6Plugin: true,
})

app.use(pinia)
app.use(router)

app.mount('#app')
