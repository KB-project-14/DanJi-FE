<script setup lang="ts">
import { useBadgeCollection } from '@/composables/badge/useBadgeCollection'
import { computed } from 'vue'

const { currentBadges, handleBadgeClick } = useBadgeCollection()

const chunkedBadges = computed(() => {
  const chunks = []
  for (let i = 0; i < currentBadges.value.length; i += 3) {
    chunks.push(currentBadges.value.slice(i, i + 3))
  }
  return chunks
})
</script>
<template>
  <div
    v-for="(badgeGroup, groupIndex) in chunkedBadges"
    :key="`group-${groupIndex}`"
    class="relative flex flex-col justify-center items-center w-[31.7rem] h-[9.7rem] mb-[2.5rem] text-Gray-8 Head03 border-solid border-[0.2rem] border-Gray-1 rounded-[1.6rem]"
  >
    <span class="absolute top-[-13%] bg-White-0">{{ badgeGroup[0].name }}</span>
    <div class="flex justify-between items-center px-[2.2rem] w-full">
      <img
        v-for="(badge, badgeIndex) in badgeGroup"
        :key="badge.badge_id"
        :src="badge.image"
        :alt="`${badge.name} 뱃지 ${badgeIndex + 1}`"
        class="w-[6rem] h-[6rem] cursor-pointer"
        @click="handleBadgeClick(badge)"
      />
    </div>
  </div>
</template>
<style scoped></style>
