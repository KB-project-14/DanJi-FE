<script setup lang="ts">
import { Search } from 'lucide-vue-next'
</script>

<template>
  <!-- 검색창 -->
  <div
    class="flex mt-[1.6rem] mx-[1.6rem] px-[2.1rem] py-[0.8rem] bg-Gray-0 Body02 rounded-[2.5rem] border-2 border-Gray-1"
  >
    <search :size="20" color="#a3a3a3" :stroke-width="1.25" />
    <input
      placeholder="가맹점명, 주소를 검색하세요"
      class="w-full ms-[1rem] bg-Gray-0 focus:outline-none focus:border-Gray-3 focus:ring-0 transition-colors"
    />
  </div>
</template>
