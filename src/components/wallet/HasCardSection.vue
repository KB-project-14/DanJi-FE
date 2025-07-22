<script setup lang="ts">
import UserCard from '@/components/common/card/UserCard.vue'

defineProps<{
  cards: { balance: number; backgroundImageUrl: string }[]
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 카드 개수 및 편집 -->
    <div class="flex items-center justify-between pr-20">
      <span class="Body02 text-Gray-6"> 나의 카드 {{ cards.length }}개</span>
      <button class="Body04 text-Gray-4 underline">순서 바꾸기</button>
    </div>

    <!-- 보유 카드 리스트 (가로 스크롤) -->
    <div class="flex gap-6 overflow-x-auto pb-1">
      <UserCard
        v-for="(card, index) in cards"
        :key="index"
        :balance="card.balance"
        :backgroundImageUrl="card.backgroundImageUrl"
        class="shrink-0 w-[275px]"
      />
    </div>

    <!-- 혜택 안내 영역  -->
  </div>
</template>
