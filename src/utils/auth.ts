import { instance } from '@/api/api'
import { useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
export const isGuest = () => !localStorage.getItem('accessToken')

export function useLogout() {
  const router = useRouter()
  const qc = useQueryClient()

  return async function logout() {
    for (const k of ['accessToken']) {
      localStorage.removeItem(k)
    }
    sessionStorage.removeItem('IS_GUEST')

    try {
      if (instance?.defaults?.headers?.common?.Authorization) {
        delete instance.defaults.headers.common.Authorization
      }
    } catch {}

    qc.clear()

    await router.replace('/login')
  }
}
