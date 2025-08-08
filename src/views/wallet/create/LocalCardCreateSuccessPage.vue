<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import CreateSuccess from '@/components/wallet/create/CreateSuccess.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleNavigateToHome = () => {
  router.replace({ name: 'Home' })
}
</script>
<template>
  <layout :header-type="'basic'" :header-title="'지역화폐 카드 발급'" :is-bottom-nav="false">
    <template #content>
      <div class="relative flex flex-col items-center h-full px-[2rem] pt-[6rem] bg-Gray-0">
        <!-- 발급 성공 -->
        <create-success />

        <danji-button
          class="absolute bottom-0 w-[34.3rem] h-[5.8rem] mb-[3rem]"
          @click="handleNavigateToHome"
          >지갑으로 가기</danji-button
        >
      </div>
    </template>
  </layout>
</template>
<style scoped></style>
