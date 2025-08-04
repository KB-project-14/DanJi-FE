// 거래내역 전체 응답
import type { WalletTransactionItemType } from './WalletTransactionItemType'

export interface WalletTransactionDataType {
  aggregateCharge: number
  aggregateIncentive: number
  transactions: WalletTransactionItemType[]
}
