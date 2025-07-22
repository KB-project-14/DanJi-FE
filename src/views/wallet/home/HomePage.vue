<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import NoCard from '@/components/common/card/NoCard.vue'
import UserCard from '@/components/common/card/UserCard.vue'
</script>

<template>
  <Layout :header-type="'main'" :is-bottom-nav="true">
    <template #content>
      <UserCard :balance="32000" backgroundImageUrl="/" />
      <NoCard />
    </template>
  </Layout>
</template>
