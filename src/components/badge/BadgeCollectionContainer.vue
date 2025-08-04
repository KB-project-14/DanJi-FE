<script setup lang="ts">
let badgeCount = 5
</script>
<template>
  <section class="flex flex-col w-full">
    <!-- 뱃지 종류 선택 버튼 -->
    <div class="flex justify-between h-[2.9rem] Head04 text-White-0">
      <button class="w-full rounded-tl-[1rem] bg-Yellow-0">지역</button>
      <button class="w-full rounded-tr-[1rem] bg-Yellow-0/20">스페셜</button>
    </div>
    <!-- 뱃지 내용 부분 -->
    <div
      class="flex flex-col justify-center items-center w-full h-[32.3rem] gap-[2.5rem] rounded-b-[1.6rem] bg-White-0"
    >
      <div class="flex justify-between w-[31.7rem] Body01">
        <span>내가 모은 뱃지를 확인해보세요</span><span>총 {{ badgeCount }}개</span>
      </div>
      <!-- 뱃지 리스트 아이템 -->
      <div
        class="relative flex flex-col justify-center items-center w-[31.7rem] h-[9.7rem] text-Gray-8 Head03 border-solid border-[0.2rem] border-Gray-1 rounded-[1.6rem]"
      >
        <span class="absolute top-[-13%] bg-White-0">행운의 감자</span>
        <div class="flex justify-between items-center px-[2.2rem] w-full">
          <img src="" alt="" class="w-[6rem] h-[6rem]" />
          <img src="" alt="" class="w-[6rem] h-[6rem]" />
          <img src="" alt="" class="w-[6rem] h-[6rem]" />
        </div>
      </div>
      <!-- 뱃지 리스트 아이템 -->
      <div
        class="relative flex flex-col justify-center items-center w-[31.7rem] h-[9.7rem] text-Gray-8 Head03 border-solid border-[0.2rem] border-Gray-1 rounded-[1.6rem]"
      >
        <span class="absolute top-[-13%] bg-White-0">돌하르방의 청혼</span>
        <div class="flex justify-between items-center px-[2.2rem] w-full">
          <img src="" alt="" class="w-[6rem] h-[6rem]" />
          <img src="" alt="" class="w-[6rem] h-[6rem]" />
          <img src="" alt="" class="w-[6rem] h-[6rem]" />
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
