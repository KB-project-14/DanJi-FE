// api 연결 관련 공용 타입 정의
export interface BaseError {
  field: string
  reason: string
}

export interface ResponseType<T = Record<string, object>> {
  isSuccess: boolean
  code: string
  message: string
  result: T
}

// 바텀네비 아이템 타입
export type BottomNaviType = 'wallet' | 'map' | 'qr' | 'badge' | 'my'

// 공통 레이아웃에서 사용하는 헤더 타입
export type HeaderType = 'basic' | 'main' | 'pay' | 'setting'

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

//가맹점 정보 타입
export interface LocalStore {
  id: number
  name: string
  address: string
  latitude: string
  longitude: string
  category: string
}
