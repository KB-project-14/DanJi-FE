<script setup lang="ts">
import { useBadgeCollection } from '@/composables/badge/useBadgeCollection'

const { selectedBadge } = useBadgeCollection()
</script>
<template>
  <div class="flex flex-col w-full h-[32.3rem] justify-center items-center">
    <div class="flex flex-col justify-center items-center mb-[0.5rem] Body02 text-Gray-4">
      <span>{{ selectedBadge?.comment }}</span>
    </div>

    <div class="flex justify-center items-center mb-[1.5rem]">
      <img
        :src="selectedBadge?.image"
        :alt="`${selectedBadge?.name} 뱃지`"
        class="w-[15.4rem] h-[15.4rem]"
      />
    </div>
    <div
      :key="selectedBadge?.badge_id"
      class="relative flex flex-col justify-center items-center w-[31.7rem] h-[9.7rem] mb-[2.5rem] text-Gray-8 Head03 border-solid border-[0.2rem] border-Gray-1 rounded-[1.6rem]"
    >
      <span class="absolute top-[-13%] bg-White-0">{{ selectedBadge?.name }}</span>

      <span
        v-if="selectedBadge?.badge_type === 'NORMAL'"
        class="flex justify-center items-center px-[7rem] text-center flex-wrap Body01 text-Black-0 break-keep"
      >
        지역화폐 사용 금액이 20만 원을 넘은 당신에게 주어지는 가장 빛나는 사랑의 증표입니다.🥇</span
      >
      <span
        v-if="selectedBadge?.badge_type === 'SPECIAL'"
        class="flex justify-center items-center px-[7rem] text-center flex-wrap Body01 text-Black-0 break-keep"
        >{{ selectedBadge?.name }} 지역을 방문한 당신! 숨겨진 스페셜 뱃지를 획득하였습니다. ✨</span
      >
    </div>
  </div>
</template>
<style scoped></style>
