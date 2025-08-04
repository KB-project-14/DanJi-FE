import type { WalletTransactionItemType } from './WalletTransactionItemType'

export interface WalletTransactionDataType {
  aggregateCharge: number
  aggregateIncentive: number
  transactions: WalletTransactionItemType[]
}
