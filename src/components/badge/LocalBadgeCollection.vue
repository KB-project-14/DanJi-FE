<script setup lang="ts">
import { useBadgeCollection } from '@/composables/badge/useBadgeCollection'

const { currentBadges, handleBadgeClick } = useBadgeCollection()
</script>
<template>
  <!-- 뱃지 리스트 아이템 -->
  <div
    v-for="(badge, index) in currentBadges"
    :key="badge.badge_id"
    class="relative flex flex-col justify-center items-center w-[31.7rem] h-[9.7rem] mb-[2.5rem] text-Gray-8 Head03 border-solid border-[0.2rem] border-Gray-1 rounded-[1.6rem]"
    @click="handleBadgeClick(badge)"
  >
    <span class="absolute top-[-13%] bg-White-0">{{ badge.name }}</span>
    <div class="flex justify-between items-center px-[2.2rem] w-full">
      <img
        :key="badge.badge_id"
        :src="badge.image"
        :alt="`${badge.name} 뱃지 ${index + 1}`"
        class="w-[6rem] h-[6rem] bg-Gray-1"
      />
    </div>
  </div>
</template>
<style scoped></style>
