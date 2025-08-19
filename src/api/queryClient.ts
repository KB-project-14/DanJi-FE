import { MutationCache, QueryCache, QueryClient } from '@tanstack/vue-query'
import type { ApiResponse } from '@/types/types'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

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

function handleApiError(error: any) {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    const mapped = CODE_MAP[error.code]
    if (mapped) showErrorToast(mapped)
    else if (error.message) showErrorToast(error.message)
    if (error.code === 'UNAUTHORIZED') {
      window.location.href = '/login'
    }
    return
  }

  const res = error?.response
  if (res?.data) {
    const data = res.data as ApiResponse<any> | { message?: string; code?: string }
    const code = (data as any)?.error?.code ?? (data as any)?.code
    const msg = CODE_MAP[code as string] ?? (data as any)?.error?.message ?? (data as any)?.message

    if (msg) {
      showErrorToast(msg)
      return
    }
  }

  if (!res) {
    showErrorToast('네트워크 연결을 확인해주세요')
    return
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError) return false
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
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
      if (mutation.meta?.successMessage) {
        showSuccessToast(mutation.meta.successMessage as string)
      }
    },
  }),
})
