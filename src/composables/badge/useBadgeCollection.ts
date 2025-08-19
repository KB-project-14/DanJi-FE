import { ref, computed, provide, inject, readonly } from 'vue'
import type { InjectionKey } from 'vue'
import type { BadgeType, Badge, BadgeCollection } from '@/types/badge/badgeTypes'

const BADGE_COLLECTION_KEY: InjectionKey<BadgeCollection> = Symbol('badge-collection')

export function provideBadgeCollection(): BadgeCollection {
  const category = ref<BadgeType>('NORMAL')
  const selectedBadge = ref<Badge | null>(null)
  const showBadgeDetail = ref(false)

  const regionBadges: Badge[] = [
    {
      badge_id: '1',
      name: '행운의 감자',
      image: 'http://danji.cloud/static/images/badge/gangwon1.webp',

      badge_type: 'NORMAL' as BadgeType,
      region_id: 1,
      comment: '포슬포슬 감자 속에 숨어 있던 행운을 콕 집어냈어요.',
    },
    {
      badge_id: '2',
      name: '행운의 감자',
      image: 'http://danji.cloud/static/images/badge/gangwon2.webp',

      badge_type: 'NORMAL' as BadgeType,
      region_id: 1,
      comment: '포슬포슬 감자 속에 숨어 있던 행운을 콕 집어냈어요.',
    },
    {
      badge_id: '3',
      name: '행운의 감자',
      image: 'http://danji.cloud/static/images/badge/gangwon3.webp',
      badge_type: 'NORMAL' as BadgeType,
      region_id: 1,
      comment: '포슬포슬 감자 속에 숨어 있던 행운을 콕 집어냈어요.',
    },
    {
      badge_id: '4',
      name: '돌하르방의 청혼',
      image: 'http://danji.cloud/static/images/badge/jeju1.webp',

      badge_type: 'NORMAL' as BadgeType,
      region_id: 2,
      comment: '제주의 돌하르방이 꽃을 들고 황금빛 마음으로 고백합니다.',
    },
    {
      badge_id: '5',
      name: '돌하르방의 청혼',
      image: 'http://danji.cloud/static/images/badge/jeju2.webp',

      badge_type: 'NORMAL' as BadgeType,
      region_id: 2,
      comment: '제주의 돌하르방이 꽃을 들고 황금빛 마음으로 고백합니다.',
    },
    {
      badge_id: '6',
      name: '돌하르방의 청혼',
      image: 'http://danji.cloud/static/images/badge/jeju3.webp',
      badge_type: 'NORMAL' as BadgeType,
      region_id: 2,
      comment: '제주의 돌하르방이 꽃을 들고 황금빛 마음으로 고백합니다.',
    },
  ]

  const specialBadges: Badge[] = [
    {
      badge_id: '7',
      name: '부산',
      image: 'http://danji.cloud/static/images/badge/busanspecial.webp',
      badge_type: 'SPECIAL' as BadgeType,
      region_id: 3,
      comment: '광안리 해변을 가르는 불꽃, 여름 밤의 부산을 느껴보세요.',
    },
    {
      badge_id: '8',
      name: '전남',
      image: 'http://danji.cloud/static/images/badge/jeonnamspecial.webp',
      badge_type: 'SPECIAL' as BadgeType,
      region_id: 4,
      comment: '푸른 차밭 위로 불어오는 바람, 싱그러운 축제가 시작돼요.',
    },
    {
      badge_id: '9',
      name: '제주',
      image: 'http://danji.cloud/static/images/badge/jejuspecial.webp',
      badge_type: 'SPECIAL' as BadgeType,
      region_id: 5,
      comment: '한라산 자락의 불빛 물결, 들판을 달리는 뜨거운 축제입니다.',
    },
    {
      badge_id: '10',
      name: '대전',
      image: 'http://danji.cloud/static/images/badge/daejeonspecial.webp',
      badge_type: 'SPECIAL' as BadgeType,
      region_id: 6,
      comment: '과학과 예술이 함께 빛나는 거리, 아이 같은 호기심을 깨워요.',
    },
    {
      badge_id: '11',
      name: '서울',
      image: 'http://danji.cloud/static/images/badge/seoulspecial.webp',
      badge_type: 'SPECIAL' as BadgeType,
      region_id: 7,
      comment: '서울의 밤을 장식하는 화려한 불꽃, 잠시 멈춰 서서 바라봅니다.',
    },
    {
      badge_id: '12',
      name: '세종',
      image: 'http://danji.cloud/static/images/badge/sejongspecial.webp',
      badge_type: 'SPECIAL' as BadgeType,
      region_id: 8,
      comment: '역사와 미래가 공존하는 무대, 빛나는 세종의 밤이에요.',
    },
    {
      badge_id: '13',
      name: '독도',
      image: 'http://danji.cloud/static/images/badge/dokdospecial.webp',
      badge_type: 'SPECIAL' as BadgeType,
      region_id: 9,
      comment: '동해의 푸른 파도 위, 묵묵히 자리를 지키는 우리 땅, 독도입니다.',
    },
    {
      badge_id: '14',
      name: '울산',
      image: 'http://danji.cloud/static/images/badge/ulsanspecial.webp',
      badge_type: 'SPECIAL' as BadgeType,
      region_id: 10,
      comment: '고래가 뛰노는 바다 위, 환호와 물보라가 가득합니다.',
    },
  ]

  const currentBadges = computed(() => (category.value === 'NORMAL' ? regionBadges : specialBadges))

  const badgeCount = computed(() => currentBadges.value.length)

  const changeCategory = (newCategory: BadgeType) => {
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
