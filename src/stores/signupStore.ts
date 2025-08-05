import { defineStore } from 'pinia'

export const useSignUpStore = defineStore('signUp', {
  state: () => ({
    name: '',
    username: '',
    password: '',
  }),
  actions: {
    setInfo(payload: { name: string; username: string; password: string }) {
      this.name = payload.name
      this.username = payload.username
      this.password = payload.password
    },
    reset() {
      this.name = ''
      this.username = ''
      this.password = ''
    },
  },
})
