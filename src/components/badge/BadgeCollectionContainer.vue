<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BadgeCategoryType } from '@/types/badge'
import LocalBadgeCollection from '@/components/badge/LocalBadgeCollection.vue'
import SpecialBadgeCollection from '@/components/badge/SpecialBadgeCollection.vue'

let category = ref<BadgeCategoryType>('지역')

// 카테고리별 뱃지 임시 mock 데이터
const regionBadges = [
  {
    id: 1,
    name: '행운의 감자',
    images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
  },
  {
    id: 2,
    name: '돌하르방의 청혼',
    images: ['img4.jpg', 'img5.jpg', 'img6.jpg'],
  },
]

const specialBadges = [
  {
    id: 3,
    name: '부산',
    images: 'special1.jpg',
  },
  {
    id: 4,
    name: '양산',
    images: 'special6.jpg',
  },
  {
    id: 5,
    name: '양양',
    images: 'special1.jpg',
  },
  {
    id: 6,
    name: '독도',
    images: 'special6.jpg',
  },
  {
    id: 5,
    name: '전주',
    images: 'special1.jpg',
  },
  {
    id: 6,
    name: '인천',
    images: 'special6.jpg',
  },
  {
    id: 5,
    name: '울릉도',
    images: 'special1.jpg',
  },
  {
    id: 6,
    name: '여수',
    images: 'special6.jpg',
  },
]

// 현재 카테고리에 따른 뱃지 목록
const currentBadges = computed(() => {
  return category.value === '지역' ? regionBadges : specialBadges
})

// 현재 카테고리에 따른 뱃지 개수
const badgeCount = computed(() => {
  return currentBadges.value.length
})

// 카테고리 변경 함수
const changeCategory = (newCategory: BadgeCategoryType) => {
  category.value = newCategory
}
</script>
<template>
  <section class="flex flex-col w-full h-[32.3rem]">
    <!-- 뱃지 종류 선택 버튼 -->
    <div class="flex justify-between h-[2.9rem] Head04 text-White-0">
      <button
        @click="changeCategory('지역')"
        :class="[
          'w-full rounded-tl-[1rem] transition-colors',
          category === '지역' ? 'bg-Yellow-0' : 'bg-Yellow-0/20',
        ]"
      >
        지역
      </button>
      <button
        @click="changeCategory('스페셜')"
        :class="[
          'w-full rounded-tr-[1rem] transition-colors',
          category === '스페셜' ? 'bg-Yellow-0' : 'bg-Yellow-0/20',
        ]"
      >
        스페셜
      </button>
    </div>
    <!-- 뱃지 내용 부분 -->
    <div
      class="flex flex-col justify-center items-center w-full h-[32.3rem] pt-[1.4rem] gap-[2.5rem] rounded-b-[1.6rem] bg-White-0"
    >
      <div class="flex-1 overflow-y-auto flex flex-col items-center justify-center w-full h-full">
        <!-- 지역 뱃지 내용 섹션 -->
        <div class="flex justify-between w-[31.7rem] mb-[2rem] Body01">
          <span>내가 모은 뱃지를 확인해보세요</span><span>총 {{ badgeCount }}개</span>
        </div>
        <local-badge-collection v-if="category === '지역'" :badges="regionBadges" />
        <special-badge-collection v-if="category === '스페셜'" :badges="specialBadges" />
      </div>

      <!-- 뱃지가 없을 때 표시할 내용 -->
      <div
        v-if="currentBadges.length === 0"
        class="flex flex-col items-center justify-center h-[15rem] text-Gray-5 Body02"
      >
        <span>아직 {{ category }} 뱃지가 없습니다</span>
        <span>더 많은 활동으로 뱃지를 획득해보세요!</span>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
