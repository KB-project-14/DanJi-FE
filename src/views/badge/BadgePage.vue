<script setup lang="ts">
import BadgePageInfo from '@/components/badge/BadgePageInfo.vue'
import BadgeCollectionContainer from '@/components/badge/BadgeCollectionContainer.vue'
import Layout from '@/components/layout/Layout.vue'
</script>
<template>
  <layout :header-type="'basic'" :header-title="'뱃지도감'" :is-bottom-nav="true">
    <template #content>
      <div class="flex flex-col items-center justify-center px-[0.9rem] pt-[0.8rem] bg-Gray-0">
        <badge-page-info />
        <badge-collection-container />
      </div>
    </template>
  </layout>
</template>
<style scoped></style>
