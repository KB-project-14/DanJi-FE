import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/styles/reset.css'
import './assets/styles/tailwind.css'
import './assets/styles/main.css'

import App from './App.vue'
import router from './router'

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser.test')
  await worker.start()
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
