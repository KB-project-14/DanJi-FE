import { post } from '@/api/api'
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  SetPinRequest,
  SetPinResponse,
} from '@/types/auth'

import axios from 'axios'

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post(
    `${import.meta.env.VITE_APP_BASE_URL}/api/members/login`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return response.data.data
}

// 회원가입
export const signUp = async (payload: SignUpRequest): Promise<SignUpResponse> => {
  const { data } = await post<SignUpResponse>('/api/auth/members', payload)
  return data.data
}

// PIN 설정
// 나중에 삭제 예정
export const setPin = async (payload: SetPinRequest): Promise<SetPinResponse> => {
  const { data } = await post<SetPinResponse>('/api/auth/pin', payload)
  return data.data
}
