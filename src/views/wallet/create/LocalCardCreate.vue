<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
</script>

<template>
  <layout header-type="basic" header-title="지역화폐 카드 발급" showLeftIcon :is-bottom-nav="false">
    <template #content>
      <!-- 상단 구분선 -->
      <div class="w-full h-[0.1rem] bg-Gray-0" />

      <!-- 지역 선택 칩 -->
      <danji-chip class="ms-[2.7rem] mt-[1.2rem]" is-active is-icon> 부산시 </danji-chip>

      <!-- 카드 이미지 임시 div -->
      <div
        class="mx-auto mt-[0.6rem] h-[19.8rem] w-[13.3rem] rounded-[0.8rem] border border-Gray-2 border-solid"
      />

      <!-- 카드 이름 -->
      <div class="text-center mt-[0.4rem]">
        <div class="text-Brown-4 Body01">부산 동백전</div>
      </div>

      <!-- 중간 구분선 -->
      <div class="w-full h-[0.5rem] mt-[0.6rem] bg-Gray-0" />

      <!-- 혜택 안내 박스 -->
      <div
        class="mx-auto w-fit max-w-[33.5rem] mt-[1.6rem] px-[1.9rem] py-[1.2rem] rounded-[1.6rem] border border-Gray-1 border-solid"
      >
        <div class="text-Black-1 Head04">동백전 혜택</div>
        <ol class="list-decimal list-inside text-Black-1 Body02 text-left">
          <li>동백전 지역화폐로 결제 시, 캐시백과 상생 가맹점 현장 할인 제공</li>
          <li>연말정산 시, 현금과 같은 30% 소득공제</li>
          <li>수시로 지원하는 프로모션</li>
        </ol>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex justify-center mt-[1.6rem]">
        <danji-button variant="large">발급하기</danji-button>
      </div>
    </template>
  </layout>
</template>
