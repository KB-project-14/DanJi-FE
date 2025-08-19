// 아래는 사용 예시입니다
// const WORK_KEYS = {
//   all: ['works'] as const,
//   lists: () => [...WORK_KEYS.all, 'list'] as const,
//   list: (category: string, currentPage: number) =>
//     [...WORK_KEYS.lists(), 'infinite', category, currentPage] as const,
//   prefetchList: (category: string, currentPage: number) =>
//     [...WORK_KEYS.lists(), 'prefetch', category, currentPage] as const,
//   details: () => [...WORK_KEYS.all, 'detail'] as const,
//   detail: (name: string, title: string) => [...WORK_KEYS.details(), name, title] as const,
// }

export const MYPAGE_KEYS = {
  all: ['mypage'] as const,
}

export const PAY_KEYS = {
  all: ['pay'] as const,
}

export const WALLET_KEYS = {
  all: ['wallets'] as const,
  list: (type: 'CASH' | 'LOCAL') => [...WALLET_KEYS.all, 'list', type] as const,
  detail: (walletId: string) => [...WALLET_KEYS.all, 'detail', walletId] as const,
  transactions: (walletId: string) => [...WALLET_KEYS.all, 'transactions', walletId] as const,
}

export const LOCAL_KEYS = {
  all: ['locals'] as const,
  detail: ['local_currencies'] as const,
  details: ['local_currrency', 'create'],
}

export const LOCAL_STORE_KEYS = {
  all: ['local_stores'] as const,
  byLocation: (lat: number, lng: number) => [...LOCAL_STORE_KEYS.all, lat, lng] as const,
}

export const SIGNUP_KEYS = {
  all: ['signup'] as const,
  create: () => [...SIGNUP_KEYS.all, 'create'] as const,
}

export const LOGIN_KEYS = {
  all: ['login'] as const,
  auth: () => [...LOGIN_KEYS.all, 'auth'] as const,
}

export const PAYMENT_PIN_KEYS = {
  all: ['payment-pin'] as const,
  verify: () => [...PAYMENT_PIN_KEYS.all, 'verify'] as const,
}
