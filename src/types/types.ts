// 바텀네비 아이템 타입
export type BottomNaviType = 'wallet' | 'map' | 'qr' | 'badge' | 'my'

// 레이아웃에서 사용하는 헤더 타입
export type LayoutProps =
  | {
      headerType: 'basic'
      headerTitle: string
      showLeftIcon?: boolean
      showRightIcon?: boolean
      isBottomNav: boolean
    }
  | {
      headerType: 'main'
      isBottomNav: boolean
    }
  | {
      headerType: 'pay'
      isBottomNav: boolean
    }
  | {
      headerType: 'none'
      isBottomNav: boolean
    }
