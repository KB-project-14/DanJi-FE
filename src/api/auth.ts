import axios from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  SetPinRequest,
  SetPinResponse,
} from '@/types/auth'

const BASE_URL = 'http://localhost:8080'

// 로그인
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/api/auth/login`, payload)
  return response.data
}

// 회원가입
export const signUp = async (payload: SignUpRequest): Promise<SignUpResponse> => {
  const response = await axios.post<SignUpResponse>(`${BASE_URL}/api/members`, payload)
  return response.data
}

// PIN 설정
export const setPin = async (payload: SetPinRequest): Promise<SetPinResponse> => {
  const response = await axios.post<SetPinResponse>(`${BASE_URL}/api/auth/pin`, payload)
  return response.data
}
