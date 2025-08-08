<script setup lang="ts">
import { useBadgeCollection } from '@/composables/badge/useBadgeCollection'

const { category, changeCategory } = useBadgeCollection()
</script>
<template>
  <div class="flex justify-between h-[2.9rem] Head04 text-White-0">
    <button
      @click="changeCategory('NORMAL')"
      :class="[
        'w-full h-[2.9rem] rounded-tl-[1rem] transition-colors',
        category === 'NORMAL' ? 'bg-Yellow-0' : 'bg-Yellow-0/20',
      ]"
    >
      지역
    </button>
    <button
      @click="changeCategory('SPECIAL')"
      :class="[
        'w-full h-[2.9rem] rounded-tr-[1rem] transition-colors',
        category === 'SPECIAL' ? 'bg-Yellow-0' : 'bg-Yellow-0/20',
      ]"
    >
      스페셜
    </button>
  </div>
</template>
<style scoped></style>
