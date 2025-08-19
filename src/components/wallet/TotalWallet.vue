<script setup lang="ts">
import { useRouter } from 'vue-router'
import useGetMember from '@/composables/queries/member/useGetMember'

import { ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const member = useGetMember()

defineProps<{
  walletAmount: number
}>()

const goWalletPage = () => {
  router.push('/wallet/view')
}
</script>
<template>
  <div class="aspect-[1586/700] rounded-xl overflow-hidden w-full shadow mx-auto flex flex-col">
    <div class="flex flex-col items-start p-4 bg-Yellow-0/40 flex-[2]">
      <span class="mb-1 Body01 text-Gray-6"
        >{{ member?.name }}님의 KB 저축 계좌 775102-00-097294
      </span>
      <span class="self-center Head0 text-Black">
        {{ (walletAmount ?? 0).toLocaleString() }}원
      </span>
    </div>

    <div
      class="flex items-center justify-end flex-[1] gap-1 p-4 bg-White-0/40 p-4"
      @click="goWalletPage"
    >
      <span class="Body02 text-Gray-6"> 지역화폐 잔액 보기 </span>
      <ChevronRight class="w-5 h-5 text-Gray-6" />
    </div>
  </div>
</template>
