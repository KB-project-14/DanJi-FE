<script setup lang="ts">
import { provideBadgeCollection } from '@/composables/badge/useBadgeCollection'
import BadgeCollectionTabs from '@/components/badge/BadgeCollectionTabs.vue'
import BadgeCollectionContents from '@/components/badge/BadgeCollectionContents.vue'
import BadgeDetail from '@/components/badge/BadgeDetail.vue'

const { showBadgeDetail } = provideBadgeCollection()
</script>
<template>
  <section class="flex flex-col w-full h-[32.3rem]">
    <!-- 뱃지 종류 선택 버튼 -->
    <badge-collection-tabs />
    <!-- 뱃지 내용 부분 -->
    <div
      class="flex flex-col justify-center items-center w-full h-[32.3rem] pt-[1.4rem] gap-[2.5rem] rounded-b-[1.6rem] bg-White-0"
    >
      <!-- 뱃지 상세 화면 -->
      <badge-detail v-if="showBadgeDetail" />
      <badge-collection-contents v-else />
    </div>
  </section>
</template>
<style scoped></style>
