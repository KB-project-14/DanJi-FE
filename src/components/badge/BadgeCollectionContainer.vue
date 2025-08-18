<script setup lang="ts">
import { provideBadgeCollection } from '@/composables/badge/useBadgeCollection'
import BadgeCollectionTabs from '@/components/badge/BadgeCollectionTabs.vue'
import BadgeCollectionContents from '@/components/badge/BadgeCollectionContents.vue'
import BadgeDetail from '@/components/badge/BadgeDetail.vue'

const { showBadgeDetail } = provideBadgeCollection()
</script>
<template>
  <section class="flex flex-col w-full h-[32.3rem]">
    <badge-collection-tabs />
    <div
      class="flex flex-col justify-center items-center w-full h-[32.3rem] pt-[1.4rem] gap-[2.5rem] rounded-b-[1.6rem] bg-White-0"
    >
      <badge-detail v-if="showBadgeDetail" />
      <badge-collection-contents v-else />
    </div>
  </section>
</template>
<style scoped></style>
