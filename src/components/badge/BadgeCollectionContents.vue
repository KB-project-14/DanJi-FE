<script setup lang="ts">
import { computed } from 'vue'
import { useBadgeCollection } from '@/composables/badge/useBadgeCollection'
import LocalBadgeCollection from '@/components/badge/LocalBadgeCollection.vue'
import SpecialBadgeCollection from '@/components/badge/SpecialBadgeCollection.vue'

const { category, regionBadges, specialBadges } = useBadgeCollection()

const currentBadges = computed(() => (category.value === 'NORMAL' ? regionBadges : specialBadges))
const badgeCount = computed(() => currentBadges.value.length)
</script>
<template>
  <div class="flex-1 overflow-y-auto flex flex-col items-center w-full h-[35.2rem]">
    <div class="flex justify-between w-[31.7rem] mb-[2rem] Body01">
      <span>내가 모은 뱃지를 확인해보세요</span>
      <span>총 {{ badgeCount }}개</span>
    </div>

    <local-badge-collection v-if="category === 'NORMAL'" />
    <special-badge-collection v-if="category === 'SPECIAL'" />

    <div
      v-if="currentBadges.length === 0"
      class="flex flex-col items-center justify-center h-[15rem] text-Gray-5 Body02"
    >
      <span>아직 {{ category }} 뱃지가 없습니다</span>
      <span>더 많은 활동으로 뱃지를 획득해보세요!</span>
    </div>
  </div>
</template>
<style scoped></style>
