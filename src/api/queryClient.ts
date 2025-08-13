import { MutationCache, QueryCache, QueryClient } from '@tanstack/vue-query'
import type { ApiResponse } from '@/types/types'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

// 커스텀 에러 클래스 (추후 백엔드 수정사항에 맞게 변경 예정)
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public method: string,
    public errors?: Array<{ field: string; reason: string }>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const CODE_MAP: Record<string, string> = {
  WALLET_BALANCE_REMAIN: '지갑 잔액이 0원이 아니므로 삭제할 수 없습니다.',
  UNAUTHORIZED: '로그인이 필요합니다.',
}

// 에러 처리 함수
function handleApiError(error: any) {
  console.error('API Error:', error)

  // 이미 ApiError인 경우 (인터셉터에서 처리됨)
  if (error instanceof ApiError) {
    // 특정 에러 코드별 처리

    const mapped = CODE_MAP[error.code]
    if (mapped) showErrorToast(mapped)
    else if (error.message) showErrorToast(error.message)
    // 특정 에러 코드별 처리
    if (error.code === 'UNAUTHORIZED') {
      // 로그인 페이지로 리디렉션
      window.location.href = '/login'
    }
    return
  }

  const res = error?.response
  // Axios 에러인 경우
  if (res?.data) {
    const data = res.data as ApiResponse<any> | { message?: string; code?: string }
    const code = (data as any)?.error?.code ?? (data as any)?.code
    const msg = CODE_MAP[code as string] ?? (data as any)?.error?.message ?? (data as any)?.message

    if (msg) {
      showErrorToast(msg)
      return
    }
  }

  // 네트워크 에러 등
  if (!res) {
    showErrorToast('네트워크 연결을 확인해주세요')
    return
  }
}

// QueryClient 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (cacheTime 대체)
      retry: (failureCount, error) => {
        // ApiError가 발생하면 API 요청 재시도 안함
        if (error instanceof ApiError) return false
        // 네트워크 에러 3번까지 재시도
        return failureCount < 3
      },
      refetchOnWindowFocus: false, // 윈도우 포커스시 자동 리페치 비활성화
    },
    mutations: {
      retry: false, // 뮤테이션은 재시도 안함
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.log('Query Cache Error:', { error, queryKey: query.queryKey })
      handleApiError(error)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      console.log('Mutation Cache Error:', {
        error,
        mutationKey: mutation.options.mutationKey,
        variables,
      })
      handleApiError(error)
    },
    onSuccess: (data, variables, context, mutation) => {
      // 성공 시 토스트 표시할지 고민중
      if (mutation.meta?.successMessage) {
        showSuccessToast(mutation.meta.successMessage as string)
      }
    },
  }),
})
