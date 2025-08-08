<script setup lang="ts">
const props = defineProps<{
  /**
   * 카드 이름
   */
  cardName: string

  /**
   * 카드 이미지 URL
   */
  cardImage?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- 카드 이미지 -->
    <div
      v-if="!cardImage"
      class="mx-auto mt-[1.8rem] h-[19.8rem] w-[13.3rem] rounded-[0.8rem] border border-Gray-2 border-solid"
    />

    <img
      v-else
      :src="cardImage"
      :alt="`${cardName} 카드`"
      class="rotate-90 h-[14rem] w-[22rem] mt-[6rem] mx-auto rounded-[1rem] shadow-md"
    />

    <!-- 카드 이름 -->
    <div class="text-center mt-[5rem]">
      <div class="text-Brown-4 Body01">{{ cardName }}</div>
    </div>
  </div>
</template>
