<script setup lang="ts">
import { useBadgeCollection } from '@/composables/badge/useBadgeCollection'

const { currentBadges, handleBadgeClick } = useBadgeCollection()
</script>
<template>
  <!-- 뱃지 리스트 아이템 -->
  <div class="flex w-full h-full justify-center items-start flex-wrap gap-[1.3rem]">
    <div
      v-for="(badge, index) in currentBadges"
      :key="badge.badge_id"
      class="flex flex-col justify-center items-center"
      @click="handleBadgeClick(badge)"
    >
      <img
        :key="badge.badge_id"
        :src="badge.image"
        :alt="`${badge.name} 뱃지 ${index + 1}`"
        class="w-[7rem] h-[7rem]"
      />
      <span class="Body01">{{ badge.name }}</span>
    </div>
  </div>
</template>
<style scoped></style>
