import { post } from '@/api/api'
import type { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse } from '@/types/auth'
import axios from 'axios'

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post(
    `${import.meta.env.VITE_APP_BASE_URL}api/members/login`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const token = response.data?.data?.accessToken
  if (token) {
    localStorage.setItem('accessToken', token)
  }

  return response.data.data
}

export const signUp = async (payload: SignUpRequest): Promise<SignUpResponse> => {
  const { data } = await post<SignUpResponse>('/api/auth/signup', payload)
  return data.data
}
