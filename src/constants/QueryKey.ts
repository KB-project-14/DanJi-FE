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

// 마이페이지 쿼리 키
export const MYPAGE_KEYS = {
  all: ['mypage'] as const,
}

// 결제하기 페이지 쿼리 키
export const PAY_KEYS = {
  all: ['pay'] as const,
}

// 메인 페이지 쿼리 키
export const WALLET_KEYS = {
  all: ['wallets'] as const,
  list: (type: 'CASH' | 'LOCAL') => [...WALLET_KEYS.all, 'list', type] as const,
  detail: (walletId: string) => [...WALLET_KEYS.all, 'detail', walletId] as const,
  transactions: (walletId: string) => [...WALLET_KEYS.all, 'transactions', walletId] as const,
}

//지역, 지역화폐 관련 쿼리 키
export const LOCAL_KEYS = {
  all: ['locals'] as const,
  detail: ['local_currencies'] as const,
  //TODO : 나중에 WALLET 쪽 쿼리 키에 합치기
  details: ['local_currrency', 'create'],
}

// 회원가입 페이지 쿼리 키
export const SIGNUP_KEYS = {
  all: ['signup'] as const,
  create: () => [...SIGNUP_KEYS.all, 'create'] as const,
}

// 로그인 페이지 쿼리 키
export const LOGIN_KEYS = {
  all: ['login'] as const,
  auth: () => [...LOGIN_KEYS.all, 'auth'] as const,
}

// 결제 비밀번호 페이지 쿼리 키
export const PAYMENT_PIN_KEYS = {
  all: ['payment-pin'] as const,
  verify: () => [...PAYMENT_PIN_KEYS.all, 'verify'] as const,
}

// 충전, 환전, 환불 쿼리 키
export const TRANSACTION_TRANSFER_KEYS = {
  all: ['transfer'] as const,
}
