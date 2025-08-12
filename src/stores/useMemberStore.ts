import { defineStore } from 'pinia'

export const useMemberStore = defineStore('member', {
  state: () => ({
    name: '',
    username: '',
    password: '',
    paymentPin: '',
  }),
  actions: {
    setInfo(payload: { name: string; username: string; password: string }) {
      this.name = payload.name
      this.username = payload.username
      this.password = payload.password
    },
    setPaymentPin(pin: string) {
      this.paymentPin = pin
    },
    reset() {
      this.name = ''
      this.username = ''
      this.password = ''
      this.paymentPin = ''
    },
  },
})
