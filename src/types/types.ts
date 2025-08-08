// api 연결 관련 공용 타입 정의

// 추후 백엔드 수정사항에 맞게 변경 예정
export interface ApiError {
  code: string
  errors: Array<{
    field: string
    reason: string
  }>
  message: string
  // method: string
}

export interface ApiResponse<T = Record<string, object>> {
  data: T
  error: ApiError | null
  status: string
}

// 바텀네비 아이템 타입
export type BottomNaviType = 'wallet' | 'map' | 'qr' | 'badge' | 'my'

// 공통 레이아웃에서 사용하는 헤더 타입
export type HeaderType = 'basic' | 'main' | 'pay' | 'setting' | 'none'

// 레이아웃 컴포넌트에서 사용하는 공통 타입
export interface BaseLayoutProps {
  isBottomNav?: boolean
}

interface HeaderWithTitle {
  headerTitle: string
  showLeftIcon?: boolean
  showRightIcon?: boolean
}

interface PayHeaderProps {
  headerTitle: string
  showRightIcon?: boolean
  emitRightIconClick?: () => void
}

// 헤더 타입에 따른 레이아웃 컴포넌트 props
export type LayoutProps =
  | ({ headerType: 'basic' | 'setting' } & HeaderWithTitle & BaseLayoutProps)
  | ({ headerType: 'main' } & BaseLayoutProps)
  | ({ headerType: 'pay' } & PayHeaderProps & BaseLayoutProps)
  | ({ headerType: 'none' } & BaseLayoutProps)
