import { MutationCache, QueryCache, QueryClient } from '@tanstack/vue-query'
import type { ApiResponse } from '@/types/types'

// 커스텀 에러 클래스 (API 클라이언트와 동일)
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Array<{ field: string; message: string }>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 에러 처리 함수
function handleApiError(error: any) {
  console.error('API Error:', error)

  // 이미 ApiError인 경우 (인터셉터에서 처리됨)
  if (error instanceof ApiError) {
    // 특정 에러 코드별 처리
    if (error.code === 'UNAUTHORIZED') {
      // 로그인 페이지로 리디렉션
      window.location.href = '/login'
    }
    return
  }

  // Axios 에러인 경우
  if (error?.response?.data) {
    const errorData = error.response.data as ApiResponse<any>

    if (errorData.error) {
      // 토스트나 알림으로 에러 표시
      showErrorToast(errorData.error.message)
    }
  }

  // 네트워크 에러 등
  if (!error.response) {
    showErrorToast('네트워크 연결을 확인해주세요')
  }
}

// 에러 토스트 함수 (토스트 라이브러리 도입할지 고민중)
function showErrorToast(message: string) {
  console.error('Toast:', message)
  // toast.error(message)
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

function showSuccessToast(message: string) {
  console.log('Success Toast:', message)
  // toast.success(message)
}
