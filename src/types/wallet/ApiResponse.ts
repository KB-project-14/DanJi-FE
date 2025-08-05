// 응답값
export interface ApiError {
  code: string
  message: string
  method: string
  errors: Array<{
    field: string
    reason: string
  }>
}

export interface ApiResponse<T> {
  data: T
  error: ApiError | null
  status: string
}
