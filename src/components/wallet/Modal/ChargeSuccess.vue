<script setup lang="ts">
import success from '@/assets/icons/success.svg'
</script>
<template>
  <section
    class="flex flex-col items-center justify-center w-full h-[35.3rem] rounded-[1.6rem] bg-White-0"
  >
    <div class="flex flex-col items-center justify-center Body02">
      <img class="w-[8rem] h-[8rem] mb-[3.1rem]" :src="success" alt="결제-성공-아이콘" />
      <span>충젅이 완료되었습니다!</span> <span>지갑으로 돌아갑니다.</span>
    </div>
  </section>
</template>
<style scoped></style>
