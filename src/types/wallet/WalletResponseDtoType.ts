// 지갑 리스트 및 상세 내역
export interface WalletResponseDtoType {
  balance: number
  createdAt: string
  displayOrder: number
  localCurrencyId: string
  memberId: string
  updatedAt: string
  walletId: string
  walletType: 'CASH' | 'LOCAL' // 통합지갑 | 지역화폐카드
  backgroundImageUrl?: string // 추후에 넣어야함

  // 메인 혜택 안내용 임시 필드
  localCurrencyName?: string
  benefitType?: string
  percentage?: number
}
