import type { Ref, ComputedRef, InjectionKey } from 'vue'

export type BadgeType = 'NORMAL' | 'SPECIAL'

export type NormalBadge = {
  badge_id: string
  name: string
  images: string[]
  badge_type: BadgeType
  region_id: number
  comment: string
}

export type Badge = {
  badge_id: string
  name: string
  image: string
  badge_type: BadgeType
  region_id: number
  comment: string
}

export interface BadgeCollection {
  category: Readonly<Ref<BadgeType>>
  selectedBadge: Readonly<Ref<Badge | null>>
  showBadgeDetail: Readonly<Ref<boolean>>

  regionBadges: Badge[]
  specialBadges: Badge[]
  currentBadges: Readonly<ComputedRef<Badge[]>>
  badgeCount: Readonly<ComputedRef<number>>

  changeCategory: (newCategory: BadgeType) => void
  handleBadgeClick: (badge: Badge) => void
  handleBackFromDetail: () => void
}

export const BADGE_COLLECTION_KEY = Symbol('badge-collection') as InjectionKey<BadgeCollection>
