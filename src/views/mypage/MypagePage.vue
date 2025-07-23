<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import profile from '@/assets/icons/profile.svg'
import rightArrow from '@/assets/icons/right-arrow.svg'

// 사용자 정보 (추후 API나 store에서 가져올 데이터)
const user = ref({
  name: '김단지',
  id: '123456',
})

// 메뉴 아이템들을 배열로 관리
const menuItems = [
  {
    label: '정보수정',
    rounded: 'rounded-t-[1.6rem]',
  },
  {
    label: '로그아웃',
    rounded: '',
  },
  {
    label: '탈퇴하기',
    rounded: 'rounded-b-[1.6rem]',
  },
]
</script>
<template>
  <layout :header-type="'basic'" :header-title="'마이페이지'">
    <template #content>
      <div class="flex flex-col items-center w-full h-full bg-Gray-0">
        <section
          class="flex flex-col justify-center items-center w-[34.6rem] h-[18.9rem] mt-[2.1rem] mb-[2.2rem] rounded-[1.6rem] bg-White-0"
        >
          <img
            class="w-[8.2rem] h-[8.2rem] mb-[0.5rem]"
            :src="profile"
            alt="마이페이지-프로필-사진"
          />
          <span class="Head01 text-Black-2">{{ user.name }}님</span>
          <span class="Body02 text-Black-0/50">ID{{ user.id }}</span>
        </section>

        <!-- 메뉴 섹션 -->
        <section class="w-full max-w-[34.2rem]">
          <div
            v-for="(item, index) in menuItems"
            :key="item.label"
            class="flex items-center justify-between w-full h-[7rem] px-[1rem] bg-White-0 cursor-pointer hover:bg-gray-50 transition-colors"
            :class="item.rounded"
          >
            <span class="Body00 select-none">{{ item.label }}</span>
            <img class="w-[2.2rem] h-[2.6rem]" :src="rightArrow" alt="화살표" />
          </div>
        </section>
      </div>
    </template>
  </layout>
</template>
<style scoped></style>
