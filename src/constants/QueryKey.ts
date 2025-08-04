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

//지역, 지역화폐 관련 쿼리 키
export const LOCAL_KEYS = {
  all: ['locals'] as const,
  detail: ['local_currrencies'] as const,
}
