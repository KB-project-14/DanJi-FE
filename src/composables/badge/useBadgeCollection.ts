import { ref, computed, provide, inject, readonly } from 'vue'
import type { InjectionKey } from 'vue'
import type { BadgeType } from '@/types/badge'
import type { BadgeCategoryType, Badge, BadgeCollection } from '@/types/badge'

const BADGE_COLLECTION_KEY: InjectionKey<BadgeCollection> = Symbol('badge-collection')

export function provideBadgeCollection(): BadgeCollection {
  const category = ref<BadgeCategoryType>('지역')
  const selectedBadge = ref<Badge | null>(null)
  const showBadgeDetail = ref(false)

  // 카테고리별 뱃지 임시 mock 데이터
  const regionBadges: Badge[] = [
    {
      badge_id: '1',
      name: '행운의 감자',
      image: 'img1.jpg',
      badge_type: '지역' as BadgeType,
      region_id: 1,
      comment: '행운의 감자 뱃지입니다',
    },
    {
      badge_id: '2',
      name: '돌하르방의 청혼',
      image: 'img4.jpg',
      badge_type: '지역' as BadgeType,
      region_id: 2,
      comment: '돌하르방의 청혼 뱃지입니다',
    },
  ]

  const specialBadges: Badge[] = [
    {
      badge_id: '3',
      name: '부산',
      image: 'special1.jpg',
      badge_type: '스페셜' as BadgeType,
      region_id: 3,
      comment: '부산 스페셜 뱃지입니다',
    },
    {
      badge_id: '4',
      name: '양산',
      image: 'special6.jpg',
      badge_type: '스페셜' as BadgeType,
      region_id: 4,
      comment: '양산 스페셜 뱃지입니다',
    },
    {
      badge_id: '5',
      name: '양양',
      image: 'special1.jpg',
      badge_type: '스페셜' as BadgeType,
      region_id: 5,
      comment: '양양 스페셜 뱃지입니다',
    },
    {
      badge_id: '6',
      name: '독도',
      image: 'special6.jpg',
      badge_type: '스페셜' as BadgeType,
      region_id: 6,
      comment: '독도 스페셜 뱃지입니다',
    },
    {
      badge_id: '7',
      name: '전주',
      image: 'special1.jpg',
      badge_type: '스페셜' as BadgeType,
      region_id: 7,
      comment: '전주 스페셜 뱃지입니다',
    },
    {
      badge_id: '8',
      name: '인천',
      image: 'special6.jpg',
      badge_type: '스페셜' as BadgeType,
      region_id: 8,
      comment: '인천 스페셜 뱃지입니다',
    },
    {
      badge_id: '9',
      name: '울릉도',
      image: 'special1.jpg',
      badge_type: '스페셜' as BadgeType,
      region_id: 9,
      comment: '울릉도 스페셜 뱃지입니다',
    },
    {
      badge_id: '10',
      name: '여수',
      image: 'special6.jpg',
      badge_type: '스페셜' as BadgeType,
      region_id: 10,
      comment: '여수 스페셜 뱃지입니다',
    },
  ]

  const currentBadges = computed(() => (category.value === '지역' ? regionBadges : specialBadges))

  const badgeCount = computed(() => currentBadges.value.length)

  const changeCategory = (newCategory: BadgeCategoryType) => {
    category.value = newCategory
    showBadgeDetail.value = false
    selectedBadge.value = null
  }

  const handleBadgeClick = (badge: Badge) => {
    selectedBadge.value = badge
    showBadgeDetail.value = true
  }

  const handleBackFromDetail = () => {
    showBadgeDetail.value = false
    selectedBadge.value = null
  }

  const badgeCollection: BadgeCollection = {
    category: readonly(category),
    selectedBadge: readonly(selectedBadge),
    showBadgeDetail: readonly(showBadgeDetail),

    regionBadges,
    specialBadges,
    currentBadges,
    badgeCount,

    changeCategory,
    handleBadgeClick,
    handleBackFromDetail,
  }

  provide(BADGE_COLLECTION_KEY, badgeCollection)
  return badgeCollection
}

export function useBadgeCollection(): BadgeCollection {
  const badgeCollection = inject(BADGE_COLLECTION_KEY)
  if (!badgeCollection) {
    throw new Error('useBadgeCollection은 provideBadgeCollection 후에 사용해야 합니다.')
  }
  return badgeCollection
}
