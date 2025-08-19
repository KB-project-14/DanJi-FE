import { defineStore } from 'pinia'
import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'
import type { WalletOrderItem } from '@/types/wallet/WalletOrder'
import { bgColors } from '@/constants/CardBgColors'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    cashWallet: null as WalletResponseDtoType | null,
    localWallets: [] as WalletResponseDtoType[],
    walletColorMap: new Map<string, string>(),
  }),

  getters: {
    allWallets: (state) => [state.cashWallet, ...state.localWallets],

    sortedLocalWallets: (state) => {
      return [...state.localWallets].sort((a, b) => a.displayOrder - b.displayOrder)
    },

    localWalletCount: (state) => state.localWallets.length,

    getWalletColor: (state) => (walletId: string) => {
      return state.walletColorMap.get(walletId) || 'bg-[#F1F1F1] text-Black-1'
    },
  },

  actions: {
    setCashWallet(wallet: WalletResponseDtoType) {
      this.cashWallet = wallet
    },

    setLocalWallets(wallets: WalletResponseDtoType[]) {
      this.localWallets = wallets
      this.assignWalletColors(wallets)
    },

    updateCashWalletBalance(newBalance: number) {
      if (this.cashWallet) {
        this.cashWallet.balance = newBalance
      }
    },

    updateCashWallet(updates: Partial<WalletResponseDtoType>) {
      if (this.cashWallet) {
        this.cashWallet = { ...this.cashWallet, ...updates }
      }
    },

    updateLocalWallet(walletId: string, updates: Partial<WalletResponseDtoType>) {
      const index = this.localWallets.findIndex((w) => w.walletId === walletId)
      if (index !== -1) {
        this.localWallets[index] = { ...this.localWallets[index], ...updates }
      }
    },

    updateLocalWalletsOrder(walletOrderList: WalletOrderItem[]) {
      const updatedWallets = [...this.localWallets]

      walletOrderList.forEach(({ walletId, displayOrder }) => {
        const wallet = updatedWallets.find((w) => w.walletId === walletId)
        if (wallet) {
          wallet.displayOrder = displayOrder
        }
      })
      updatedWallets.sort((a, b) => a.displayOrder - b.displayOrder)
      this.localWallets = updatedWallets
    },

    updateLocalWalletBalance(walletId: string, newBalance: number) {
      this.updateLocalWallet(walletId, { balance: newBalance })
    },

    updateLocalWalletImage(walletId: string, backgroundImageUrl: string) {
      this.updateLocalWallet(walletId, { backgroundImageUrl })
    },

    getLocalWalletById(walletId: string) {
      return this.localWallets.find((w) => w.walletId === walletId) || null
    },

    addLocalWallet(wallet: WalletResponseDtoType) {
      this.localWallets.push(wallet)
      this.assignWalletColors([wallet])
    },

    removeLocalWallet(walletId: string) {
      this.localWallets = this.localWallets.filter((w) => w.walletId !== walletId)
    },

    refreshWalletData(cashWallet: WalletResponseDtoType, localWallets: WalletResponseDtoType[]) {
      this.setCashWallet(cashWallet)
      this.setLocalWallets(localWallets)
    },

    reset() {
      this.cashWallet = null
      this.localWallets = []
      this.walletColorMap.clear()
    },

    assignWalletColors(wallets: WalletResponseDtoType[]) {
      wallets.forEach((wallet, _) => {
        if (!this.walletColorMap.has(wallet.walletId)) {
          const colorIndex = this.walletColorMap.size % bgColors.length
          const newColor = bgColors[colorIndex]

          this.walletColorMap.set(wallet.walletId, newColor)
        }
      })
    },
  },
  persist: {
    storage: localStorage,
    serializer: {
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          walletColorMap: Array.from(state.walletColorMap.entries()),
        })
      },
      deserialize: (stateString) => {
        const state = JSON.parse(stateString)
        return {
          ...state,
          walletColorMap: new Map(state.walletColorMap),
        }
      },
    },
  },
})
