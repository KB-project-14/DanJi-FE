export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  memberId: string
}

export interface SignUpResponse {
  memberId: string
  username: string
  name: string
  createdAt: string
}

export interface SignUpRequest {
  username: string
  password: string
  name: string
  paymentPin: string
}

export interface SetPinRequest {
  username: string
  pin: string
}

export interface SetPinResponse {
  success: boolean
}
