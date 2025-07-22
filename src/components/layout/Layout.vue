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

    <!-- 메인 콘텐츠 영역 (페이지별 컴포넌트가 들어갈 곳) -->
    <section class="flex-1 overflow-auto">
      <slot name="content" class="w-full h-full mt-[7.2rem]">
        <!-- 기본 fallback 콘텐츠 -->
        <div class="w-full h-full p-4 text-center text-Gray-5 bg-Gray-1">
          페이지 콘텐츠를 추가해주세요
        </div>
      </slot>
    </section>

    <!-- 바텀네비는 true 설정해줄 때만 렌더링 -->
    <BottomNav v-if="headerProps.isBottomNav" />
  </div>
</template>
<style scoped></style>
