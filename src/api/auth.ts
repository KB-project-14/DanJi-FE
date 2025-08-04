import axios from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  SetPinRequest,
  SetPinResponse,
} from '@/types/auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// 로그인
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>(`${BASE_URL}/api/auth/login`, payload)
  localStorage.setItem('member_id', data.memberId) // ✅ UUID 저장
  localStorage.setItem('EXIT_LOGIN_TOKEN', data.accessToken)
  localStorage.setItem('EXIT_LOGIN_REFRESH_TOKEN', data.refreshToken)
  return data
}

// 회원가입
export const signUp = async (payload: SignUpRequest): Promise<SignUpResponse> => {
  const { data } = await axios.post<SignUpResponse>(`${BASE_URL}/api/members`, payload)
  localStorage.setItem('member_id', data.memberId) // ✅ UUID 저장
  return data
}

// PIN 설정
export const setPin = async (payload: SetPinRequest): Promise<SetPinResponse> => {
  const response = await axios.post<SetPinResponse>(`${BASE_URL}/api/auth/pin`, payload)
  return response.data
}
