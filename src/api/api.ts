import type { ApiError } from '@/types/types'
import axios, { type AxiosInstance } from 'axios'

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

// API Response 공통 타입 - error 등 구체적인 타입은 수정 가능성 있음
export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  status: string
}

export const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    //  Authorization: `${getAccessTokenLocalStorage()}`
  },
})

export function get<T>(...args: Parameters<typeof instance.get>) {
  return instance.get<T, T>(...args)
}

export function post<T>(...args: Parameters<typeof instance.post>) {
  return instance.post<T>(...args)
}

export function put<T>(...args: Parameters<typeof instance.put>) {
  return instance.put<T>(...args)
}

export function patch<T>(...args: Parameters<typeof instance.patch>) {
  return instance.patch<T, T>(...args)
}

export function del<T>(...args: Parameters<typeof instance.delete>) {
  return instance.delete<T>(...args)
}
