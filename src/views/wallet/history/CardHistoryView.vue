<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import CardHistoryItem from '@/components/common/history/CardHistoryItem.vue'
</script>
<template>
  <layout :header-type="'basic'" :header-title="'제목'" :is-bottom-nav="false" :showLeftIcon="true">
    <template #content>
      <card-history-item
        comment="가맹점"
        :amount="10000"
        direction="EXPENSE"
        type="PAYMENT"
        :after-balance="0"
        created-at="2025-07-18T10:20:40"
      />
    </template>
  </layout>
</template>
