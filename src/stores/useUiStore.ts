import { defineStore } from 'pinia'

type ToastKind = 'success' | 'error' | 'warning' | 'info'
interface NextToast {
  type: ToastKind
  msg: string
  // vue3-toastify 옵션 그대로 전달 가능 (autoClose, position 등)
  opts?: Record<string, any>
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    nextToast: null as NextToast | null,
  }),
  actions: {
    setNextToast(t: NextToast) {
      this.nextToast = t
    },
    popNextToast() {
      const t = this.nextToast
      this.nextToast = null
      return t
    },
  },
})
