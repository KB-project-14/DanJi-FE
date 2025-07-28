<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

const router = useRouter()

defineProps<{
  walletAmount: number
  totalAsset: number
}>()

// 통합 지갑 선택시 총자산보기 페이지 이동
const goWalletPage = () => {
  router.push('/wallet/view')
}
</script>
<template>
  <div class="aspect-[1586/700] rounded-xl overflow-hidden w-full shadow mx-auto flex flex-col">
    <!-- 상단 영역: 2/3 비율 -->
    <div class="flex flex-col items-start p-4 bg-Yellow-0/40 flex-[2]">
      <span class="mb-1 Head4 text-Gray-6">통합지갑</span>
      <span class="self-center Head0 text-Black">{{ walletAmount.toLocaleString() }}원</span>
    </div>

    <!-- 하단 영역: 1/3 비율 -->
    <div
      class="bg-White-0/40 p-4 flex items-center justify-end flex-[1] gap-1"
      @click="goWalletPage"
    >
      <span class="Body02 text-Gray-6"> 지역화폐 잔액 보기 </span>
      <ChevronRight class="text-Gray-6 w-5 h-5" />
    </div>
  </div>
</template>

<style></style>
