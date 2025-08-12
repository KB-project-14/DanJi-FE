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
    // 모든 지갑 목록
    allWallets: (state) => [state.cashWallet, ...state.localWallets],

    sortedLocalWallets: (state) => {
      return [...state.localWallets].sort((a, b) => a.displayOrder - b.displayOrder)
    },

    // 지역화폐 개수
    localWalletCount: (state) => state.localWallets.length,

    // 특정 카드 ID에 할당된 배경 색상 클래스 반환
    getWalletColor: (state) => (walletId: string) => {
      return state.walletColorMap.get(walletId) || 'bg-[#F1F1F1] text-Black-1'
    },
  },

  actions: {
    // 현금 지갑 설정
    setCashWallet(wallet: WalletResponseDtoType) {
      this.cashWallet = wallet
    },

    // 지역화폐 지갑 목록 설정
    setLocalWallets(wallets: WalletResponseDtoType[]) {
      this.localWallets = wallets
      this.assignWalletColors(wallets)
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
      this.assignWalletColors([wallet])
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
      this.walletColorMap.clear()
    },

    // 지갑별로 고유 색상을 할당
    assignWalletColors(wallets: WalletResponseDtoType[]) {
      wallets.forEach((wallet, _) => {
        // 이미 색상이 할당된 지갑은 패스
        if (!this.walletColorMap.has(wallet.walletId)) {
          // walletColorMap의 크기를 기준으로 색상 인덱스 할당
          const newColor = bgColors[this.walletColorMap.size % bgColors.length]
          this.walletColorMap.set(wallet.walletId, newColor)
        }
      })
    },
  },
  persist: {
    storage: localStorage,
    serializer: {
      serialize: (state) => {
        // Map을 배열로 변환하여 JSON.stringify가 처리할 수 있도록 설정
        return JSON.stringify({
          ...state,
          walletColorMap: Array.from(state.walletColorMap.entries()),
        })
      },
      deserialize: (stateString) => {
        const state = JSON.parse(stateString)
        // 배열을 다시 Map으로 복구
        return {
          ...state,
          walletColorMap: new Map(state.walletColorMap),
        }
      },
    },
  },
})
