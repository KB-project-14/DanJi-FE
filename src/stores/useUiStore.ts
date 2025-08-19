import { defineStore } from 'pinia'

type ToastKind = 'success' | 'error' | 'warning' | 'info'
interface NextToast {
  type: ToastKind
  msg: string
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
