export type cardType = 'LOCAL_CURRENCY' | 'GENERAL'

export type payDirectionType = 'INCOME' | 'EXPENSE'

export type payType = 'CHARGE' | 'REFUND' | 'CONVERT' | 'PAYMENT'

export interface payResponseDtoType {
  createdAt: string
  updatedAt: string
  transactionId: string
  fromWalletId: string
  toWalletId: string
  beforeBalance: number
  amount: number
  afterBalance: number
  direction: payDirectionType
  type: payType
  comment: string
  ownerWalletId: string
}

export interface payRequestDtoType {
  availableMerchantId: string
  inputAmount: number
  localWalletId: string
  merchantAmount: number
  type: cardType
  walletPin: string
}
