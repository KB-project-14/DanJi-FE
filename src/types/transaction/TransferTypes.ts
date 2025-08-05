//충전, 환불, 환전
export type TransferType = 'CHARGE' | 'REFUND' | 'CONVERT'
export type TransferDirection = 'INCOME' | 'OUTCOME'

export interface TransferRequestDTO {
  amount: number
  fromWalletId: string
  toWalletId: string
  transactionLogging: boolean
  type: TransferType
}

export interface TransferResponseDTO {
  transactionId: string
  ownerWalletId: string
  fromWalletId: string
  toWalletId: string
  amount: number
  beforeBalance: number
  afterBalance: number
  comment: string
  direction: TransferDirection
  type: TransferType
  createdAt: string
  updatedAt: string
}
