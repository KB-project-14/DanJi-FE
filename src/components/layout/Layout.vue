<script setup lang="ts">
import type { LayoutProps } from '@/types/types'
import MainHeader from '../common/topbar/MainHeader.vue'
import PayHeader from '../common/topbar/PayHeader.vue'
import Header from '../common/topbar/Header.vue'
import BottomNav from '../common/bottomnav/BottomNav.vue'

/**
 * Layout 컴포넌트
 *
 * 공용 레이아웃 템플릿으로 페이지 구조를 제공합니다.
 *
 * @example 기본 사용법
 * ```vue
 * <Layout :header-type="'basic'" :header-title="'제목'" :is-bottom-nav="false">
 *   <template #content>
 *     <YourPageContent />
 *   </template>
 * </Layout>
 * ```
 *
 * @prop {('main'|'pay'|'basic'|'none')} headerType - 헤더 타입
 * @prop {string} [headerTitle] - 헤더 제목 (basic 타입에서만 필수)
 * @prop {boolean} [showLeftIcon=false] - 왼쪽 아이콘 표시 (basic 타입)
 * @prop {boolean} [showRightIcon=false] - 오른쪽 아이콘 표시 (basic 타입)
 * @prop {boolean} isBottomNav - 하단 네비게이션 표시 여부
 *
 * @slot content - 페이지 메인 콘텐츠 영역 (자동 스크롤 처리)
 *
 * @note 헤더 타입별 용도
 * - main: 홈페이지
 * - pay: 결제페이지
 * - basic: 일반페이지 (제목+아이콘 표시하는 헤더)
 * - none: 헤더 없음
 */

const headerProps = defineProps<LayoutProps>()
</script>
<template>
  <div class="flex flex-col h-screen minw-[37.5rem]">
    <!-- 헤더 타입에 따라 다른 컴포넌트 렌더링 -->
    <MainHeader v-if="headerProps.headerType === 'main'" />
    <PayHeader v-else-if="headerProps.headerType === 'pay'" />
    <Header
      v-else-if="headerProps.headerType === 'basic'"
      :title="headerProps.headerTitle"
      :show-left-icon="headerProps.showLeftIcon"
      :show-right-icon="headerProps.showRightIcon"
    />

    <!-- <!— 메인 콘텐츠 영역 (페이지별 컴포넌트가 들어갈 곳) —> -->
    <section class="flex-1 overflow-auto w-full h-full">
      <slot name="content">
        <!— 기본 fallback 콘텐츠 —>
        <div class="w-full h-full p-4 text-center text-Gray-5 bg-Gray-1">
          페이지 콘텐츠를 추가해주세요
        </div>
      </slot>
    </section>

    <!-- <!— 바텀네비는 true 설정해줄 때만 렌더링 —> -->
    <BottomNav v-if="headerProps.isBottomNav" />
  </div>
</template>
<style scoped></style>
