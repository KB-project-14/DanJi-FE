import type { ApiError } from '@/types/types'
import axios, { type AxiosInstance } from 'axios'
import type { AxiosResponse } from 'axios'

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

// API Response 공통 타입 - error 등 구체적인 타입은 수정 가능성 있음
export interface ApiResponse<T> {
  data: T
  error: ApiError
  status: string
}

export const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_DEV_ACCESS_TOKEN}`,
  },
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export type ApiResult<T> = AxiosResponse<ApiResponse<T>>

export function get<T>(...args: Parameters<typeof instance.get>): Promise<ApiResult<T>> {
  return instance.get<ApiResponse<T>>(...args)
}

export function post<T>(...args: Parameters<typeof instance.post>): Promise<ApiResult<T>> {
  return instance.post<ApiResponse<T>>(...args)
}

export function put<T>(...args: Parameters<typeof instance.put>): Promise<ApiResult<T>> {
  return instance.put<ApiResponse<T>>(...args)
}

export function patch<T>(...args: Parameters<typeof instance.patch>): Promise<ApiResult<T>> {
  return instance.patch<ApiResponse<T>>(...args)
}

export function del<T>(...args: Parameters<typeof instance.delete>): Promise<ApiResult<T>> {
  return instance.delete<ApiResponse<T>>(...args)
}
