<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

interface Props {
  searchValue: string
  isSearchActive: boolean
}

interface Emits {
  (e: 'search-clear'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClearClick = () => {
  emit('search-clear')
}
</script>

<template>
  <!-- 검색창 -->
  <div
    class="flex mt-[1.6rem] mx-[1.6rem] px-[2.1rem] py-[0.8rem] bg-Gray-0 Body02 rounded-[2.5rem] border-2 border-Gray-1"
  >
    <!-- 아이콘 영역 -->
    <div class="flex items-center">
      <search v-if="!isSearchActive" :size="20" color="#a3a3a3" :stroke-width="1.25" />
      <button
        v-else
        @click="handleClearClick"
        class="p-1 hover:bg-gray-200 rounded-full transition-colors"
        aria-label="검색 초기화"
      >
        <x :size="18" color="#666666" :stroke-width="1.5" />
      </button>
    </div>

    <!-- 입력창 -->
    <input
      :value="searchValue"
      :placeholder="isSearchActive ? '' : '가맹점명, 주소를 검색하세요'"
      class="w-full ms-[1rem] bg-Gray-0 focus:outline-none focus:border-Gray-3 focus:ring-0 transition-colors"
      readonly
    />
  </div>
</template>
