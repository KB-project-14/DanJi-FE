<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import ExchangeTabs from '@/components/wallet/exchange/ExchangeTab.vue'

const activeTab = ref(0) // 0 = 지역→지역, 1 = 지역→현금

const tabs = ['지역 → 지역', '지역 → 현금']

const handleTabChange = (index: number) => {
  activeTab.value = index
}
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="'환전하기'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="bg-Background">
        <!-- 탭 -->
        <ExchangeTabs :tabs="tabs" :activeIndex="activeTab" @change="handleTabChange" />

        <!-- 탭별 내용 -->
        <div v-if="activeTab === 0">
          <!-- 지역 → 지역 UI -->
        </div>
        <div v-else>
          <!-- 지역 → 현금 UI -->
        </div>
      </div>
    </template>
  </Layout>
</template>
