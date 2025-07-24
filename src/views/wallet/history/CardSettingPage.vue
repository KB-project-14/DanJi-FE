<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import { ChevronRight } from 'lucide-vue-next'

const goToPasswordChange = () => {
  // 비밀번호 수정 페이지 이동 로직
}

const goToCardRemove = () => {
  // 카드 해지 페이지 이동 로직
}
</script>

<template>
  <layout
    :header-type="'basic'"
    :header-title="'카드 설정'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="flex flex-col bg-White-1">
        <!-- 비밀번호 수정 -->
        <div
          class="flex justify-between items-center py-[2rem] px-[2.4rem]"
          @click="goToPasswordChange"
        >
          <span class="Body00 text-Black-1">비밀번호 수정</span>
          <ChevronRight class="w-[1.2rem] y-[1.2rem] text-Gray-5" />
        </div>

        <!-- 카드 해지 -->
        <div
          class="flex justify-between items-center py-[2rem] px-[2.4rem]"
          @click="goToCardRemove"
        >
          <span class="Body00 text-Black-1">카드 해지</span>
          <ChevronRight class="w-[1.2rem] y-[1.2rem] text-Gray-5" />
        </div>
      </div>
    </template>
  </layout>
</template>
