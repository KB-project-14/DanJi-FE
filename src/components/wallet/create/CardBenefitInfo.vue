<script setup lang="ts">
const props = defineProps<{
  /**
   * 카드 소개 타이틀
   */
  title: string

  /**
   * 카드 소개 서브 타이틀
   */
  subTitle: string

  /**
   * 인센티브 혜택 텍스트
   */
  incentiveText: string

  /**
   * 최대 충전 가능 금액
   */
  maxChargeAmount: string

  /**
   * 카드 부가 설명
   */
  description: string
}>()
</script>

<template>
  <div class="flex flex-col mt-[3rem] mx-[2.7rem]">
    <!-- 카드 소개 타이틀 -->
    <span class="Head03 text-Black-1">{{ title }}</span>

    <!-- 카드 소개 서브 타이틀 -->
    <span class="Head03 text-Black-1">{{ subTitle }}</span>

    <!-- 혜택 섹션 -->
    <span class="mt-[2rem] Head01 text-Black-1">Benefits</span>
    <span class="mt-[0.3rem] Head04 text-Brown-2">{{ incentiveText }}</span>

    <!-- 최대 충전 금액 -->
    <div>
      <span class="Body02 text-Gray-5">최대 충전 가능 금액</span>
      <span class="ms-[0.5rem] Head04 text-Yellow-1">{{ maxChargeAmount }}</span>
    </div>

    <!-- 부가 설명 -->
    <span class="mt-[1.2rem] Body02 text-Black-1">
      {{ description }}
    </span>
  </div>
</template>
