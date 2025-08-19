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

export type BottomNaviType = 'wallet' | 'map' | 'qr' | 'badge' | 'my'

export type HeaderType = 'basic' | 'main' | 'pay' | 'setting' | 'none'

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

export type LayoutProps =
  | ({ headerType: 'basic' | 'setting' } & HeaderWithTitle & BaseLayoutProps)
  | ({ headerType: 'main' } & BaseLayoutProps)
  | ({ headerType: 'pay' } & PayHeaderProps & BaseLayoutProps)
  | ({ headerType: 'none' } & BaseLayoutProps)
