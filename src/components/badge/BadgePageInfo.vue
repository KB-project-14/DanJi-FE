<script setup lang="ts">
import Tooltip from '../common/tooltip/Tooltip.vue'
</script>
<template>
  <div
    class="relative flex flex-col justify-center items-start w-full h-[6.7rem] px-[1.4rem] mt-[1rem] mb-[2.1rem] rounded-[1.6rem] bg-White-0 Body01"
  >
    <span class="leading-[0.2rem]"
      >당신의 지역화폐 사용 이력이 <span class="text-Yellow-0">특별한 뱃지</span>로
      기록됩니다.</span
    ><br />
    <span class="leading-[0.2rem]">많이 쓸수록 더 반짝이는 뱃지를 만나보세요!</span>
    <div class="absolute right-[0.8rem] bottom-[0.8rem]">
      <Tooltip
        message="(동 🥉 5만 원 / 은 🥈 10만 원 / 금 🥇 20만 원 이상)"
        position="bottom"
        align="end"
      />
    </div>
  </div>
</template>
<style scoped></style>
