<script setup lang="ts">
import type { LayoutProps } from '@/types/types'
import MainHeader from '../common/topbar/MainHeader.vue'
import PayHeader from '../common/topbar/PayHeader.vue'
import Header from '../common/topbar/Header.vue'
import BottomNav from '../common/bottomnav/BottomNav.vue'

const headerProps = defineProps<LayoutProps>()
</script>
<template>
  <div class="flex flex-col h-screen w-[37.5rem]">
    <!-- 헤더 타입에 따라 다른 컴포넌트 렌더링 -->
    <MainHeader v-if="headerProps.headerType === 'main'" />
    <PayHeader v-else-if="headerProps.headerType === 'pay'" />
    <Header
      v-else-if="headerProps.headerType === 'basic'"
      :title="headerProps.headerTitle"
      :show-left-icon="headerProps.showLeftIcon"
      :show-right-icon="headerProps.showRightIcon"
    />
    <!-- 헤더 타입이 'none'일 때는 아무것도 렌더링하지 않음 -->

    <BottomNav v-if="headerProps.isBottomNav" class="flex-grow" />
  </div>
</template>
<style scoped></style>
