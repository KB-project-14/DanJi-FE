<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
</script>
<template>
  <layout :header-type="'basic'" :header-title="'제목'" :is-bottom-nav="false">
    <template #content>
      <YourPageContent />
    </template>
  </layout>
</template>
