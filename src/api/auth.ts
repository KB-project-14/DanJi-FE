import { post } from '@/api/api'
import axios from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  SetPinRequest,
  SetPinResponse,
} from '@/types/auth'

// 로그인
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/auth/login`, payload)
  return res.data
}

// 회원가입
export const signUp = async (payload: SignUpRequest): Promise<SignUpResponse> => {
  const { data } = await post<SignUpResponse>('/api/auth/signup', payload)
  return data.data
}

// PIN 설정
export const setPin = async (payload: SetPinRequest): Promise<SetPinResponse> => {
  const { data } = await post<SetPinResponse>('/api/auth/pin', payload)
  return data.data
}
