<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import LocalStoreCategoryChip from './LocalStoreCategoryChip.vue'
import type { LocalStoreResponseDTO } from '@/types/store/storeTypes'

const props = defineProps<{
  localStore: LocalStoreResponseDTO
}>()
</script>

<template>
  <div class="px-[2rem] pt-[1.6rem] pb-[2.7rem] bg-White-0">
    <!-- 가맹점 이름과 카테고리 -->
    <div class="flex justify-between items-center">
      <span class="Head04 text-Black-1">{{ localStore.name }}</span>
      <local-store-category-chip :category="localStore.category" />
    </div>

    <!-- 주소 정보 -->
    <div class="flex items-center mt-[1.5rem]">
      <map-pin :size="18" class="text-Gray-4 flex-shrink-0" />
      <span
        class="w-full ms-[0.8rem] py-[1rem] px-[1.2rem] bg-Gray-0 text-Gray-8 Body01 rounded-[0.8rem]"
        >{{ localStore.address }}</span
      >
    </div>
  </div>

  <hr class="border-t border-Gray-0" />
</template>
