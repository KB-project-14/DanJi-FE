import axios from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  SetPinRequest,
  SetPinResponse,
} from '@/types/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

// 로그인
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/api/auth/login', payload)
  return data
}

// 회원가입
export const signUp = async (payload: SignUpRequest): Promise<SignUpResponse> => {
  const { data } = await api.post<SignUpResponse>('/api/members', payload)
  return data
}

// PIN 설정
export const setPin = async (payload: SetPinRequest): Promise<SetPinResponse> => {
  const { data } = await api.post<SetPinResponse>('/api/auth/pin', payload)
  return data
}
