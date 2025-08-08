import { defineStore } from 'pinia'
import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    cashWallet: null as WalletResponseDtoType | null,
    localWallets: [] as WalletResponseDtoType[],
  }),

  getters: {
    // 모든 지갑 목록
    allWallets: (state) => [state.cashWallet, ...state.localWallets],

    sortedLocalWallets: (state) => {
      return [...state.localWallets].sort((a, b) => a.displayOrder - b.displayOrder)
    },

    // 지역화폐 개수
    localWalletCount: (state) => state.localWallets.length,
  },

  actions: {
    // 현금 지갑 설정
    setCashWallet(wallet: WalletResponseDtoType) {
      this.cashWallet = wallet
    },

    // 지역화폐 지갑 목록 설정
    setLocalWallets(wallets: WalletResponseDtoType[]) {
      this.localWallets = wallets
    },

    // 현금 지갑 잔액 업데이트
    updateCashWalletBalance(newBalance: number) {
      if (this.cashWallet) {
        this.cashWallet.balance = newBalance
      }
    },

    // 현금 지갑 정보 업데이트 (잔액, 이미지 URL 등)
    updateCashWallet(updates: Partial<WalletResponseDtoType>) {
      if (this.cashWallet) {
        this.cashWallet = { ...this.cashWallet, ...updates }
      }
    },

    // 특정 지역화폐 지갑 업데이트
    updateLocalWallet(walletId: string, updates: Partial<WalletResponseDtoType>) {
      const index = this.localWallets.findIndex((w) => w.walletId === walletId)
      if (index !== -1) {
        this.localWallets[index] = { ...this.localWallets[index], ...updates }
      }
    },

    // 지역화폐 지갑 잔액만 업데이트
    updateLocalWalletBalance(walletId: string, newBalance: number) {
      this.updateLocalWallet(walletId, { balance: newBalance })
    },

    // 지역화폐 지갑 이미지 URL 업데이트
    updateLocalWalletImage(walletId: string, backgroundImageUrl: string) {
      this.updateLocalWallet(walletId, { backgroundImageUrl })
    },

    // ID로 지역화폐 지갑 찾기
    getLocalWalletById(walletId: string) {
      return this.localWallets.find((w) => w.walletId === walletId) || null
    },

    // 지역화폐 지갑 추가
    addLocalWallet(wallet: WalletResponseDtoType) {
      this.localWallets.push(wallet)
    },

    // 지역화폐 지갑 제거
    removeLocalWallet(walletId: string) {
      this.localWallets = this.localWallets.filter((w) => w.walletId !== walletId)
    },

    // 모든 지갑 정보 새로고침 (API에서 최신 정보 받아올 때)
    refreshWalletData(cashWallet: WalletResponseDtoType, localWallets: WalletResponseDtoType[]) {
      this.setCashWallet(cashWallet)
      this.setLocalWallets(localWallets)
    },

    reset() {
      this.cashWallet = null
      this.localWallets = []
    },
  },
})
