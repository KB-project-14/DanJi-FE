// 로그인 요청
export interface LoginRequest {
  username: string
  password: string
}

// 로그인 응답
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  memberId: string
}

// 회원가입 요청
export interface SignUpResponse {
  memberId: string
  username: string
  name: string
  createdAt: string
}

// 회우너가입 응답
export interface SignUpRequest {
  username: string
  password: string
  name: string
  paymentPin: string
}

// PIN 설정 요청
export interface SetPinRequest {
  username: string
  pin: string
}

// PIN 설정 응답
export interface SetPinResponse {
  success: boolean
}
