// 로그인 요청
export interface LoginRequest {
  username: string
  password: string
}

// 로그인 응답
export interface LoginResponse {
  memberId: string
  success: boolean
  accessToken: string
  refreshToken: string
  message?: string
}

// 회원가입 요청
export interface SignUpRequest {
  name: string
  username: string
  password: string
  paymentPin: string
}

// 회원가입 응답
export interface SignUpResponse {
  success: boolean
  memberId: string
  message?: string
}

// PIN 설정 요청
export interface SetPinRequest {
  username: string
  pin: string
}

// PIN 설정 응답
export interface SetPinResponse {
  success: boolean
  message?: string
}
