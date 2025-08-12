import { defineStore } from 'pinia'

export const useMemberStore = defineStore('member', {
  state: () => ({
    name: '',
    username: '',
    password: '',
    paymentPin: '',
    currentLocation: '',
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
    setCurrentLocation(location: string) {
      this.currentLocation = location
    },

    reset() {
      this.name = ''
      this.username = ''
      this.password = ''
      this.paymentPin = ''
      this.currentLocation = ''
    },
  },
})
