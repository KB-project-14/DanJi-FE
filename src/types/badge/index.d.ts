export type BadgeCategoryType = '지역' | '스페셜'

export type BadgeType = 'NORMAL' | 'SPECIAL'

export type Badge = {
  badge_id: string
  name: string
  image: string
  badge_type: BadgeType
  region_id: number
  comment: string
}

export interface BadgeCollection {
  category: Readonly<Ref<BadgeCategoryType>>
  selectedBadge: Readonly<Ref<Badge | null>>
  showBadgeDetail: Readonly<Ref<boolean>>

  regionBadges: Badge[]
  specialBadges: Badge[]
  currentBadges: Readonly<ComputedRef<Badge[]>>
  badgeCount: Readonly<ComputedRef<number>>

  changeCategory: (newCategory: BadgeCategoryType) => void
  handleBadgeClick: (badge: Badge) => void
  handleBackFromDetail: () => void
}

export const BADGE_COLLECTION_KEY = Symbol('badge-collection') as InjectionKey<BadgeCollection>
