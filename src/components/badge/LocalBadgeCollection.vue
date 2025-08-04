<script setup lang="ts">
import type { BadgeCategoryType } from '@/types/badge'

interface LocalBadgeProps {
  badgeCount: number
  category: BadgeCategoryType
  badges: Array<{
    id: number
    name: string
    images: string[]
  }>
}

const props = defineProps<LocalBadgeProps>()
</script>
<template>
  <div class="flex-1 overflow-y-auto flex flex-col items-center justify-center w-full h-full">
    <!-- 지역 뱃지 내용 섹션 -->
    <div class="flex justify-between w-[31.7rem] mb-[2rem] Body01">
      <span>내가 모은 뱃지를 확인해보세요</span><span>총 {{ props.badgeCount }}개</span>
    </div>
    <!-- 뱃지 리스트 아이템 -->
    <div
      v-for="badge in props.badges"
      :key="badge.id"
      class="relative flex flex-col justify-center items-center w-[31.7rem] h-[9.7rem] mb-[2.5rem] text-Gray-8 Head03 border-solid border-[0.2rem] border-Gray-1 rounded-[1.6rem]"
    >
      <span class="absolute top-[-13%] bg-White-0">{{ badge.name }}</span>
      <div class="flex justify-between items-center px-[2.2rem] w-full">
        <img
          v-for="(image, index) in badge.images"
          :key="index"
          :src="image"
          :alt="`${badge.name} 뱃지 ${index + 1}`"
          class="w-[6rem] h-[6rem] bg-Gray-1"
        />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
