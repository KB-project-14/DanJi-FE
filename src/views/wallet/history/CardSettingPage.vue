<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Layout from '@/components/layout/Layout.vue'
import { ChevronRight, Wallet } from 'lucide-vue-next'
import CardDeleteModal from '@/components/common/modal/CardDeleteModal.vue'

import useDeleteWallet from '@/composables/queries/wallet/deleteWallet'

const router = useRouter()
const route = useRoute()

const walletId = route.params.walletId as string
const { mutate: deleteWallet } = useDeleteWallet()

const showDeleteModal = ref(false)

const goToCardRemove = () => {
  showDeleteModal.value = true
}

// 해지
const handleCardDelete = () => {
  if (!walletId) {
    console.error('walletId 없음!')
    return
  }

  // 삭제 API
  deleteWallet(walletId, {
    onSuccess: () => {
      showDeleteModal.value = false
      router.push('/home')
    },
    onError: (error) => {
      console.error('카드 해지 실패:', error)
      alert('카드 해지 중 오류가 발생했습니다.')
    },
  })
}
</script>

<template>
  <layout
    :header-type="'basic'"
    :header-title="'카드 설정'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="flex flex-col bg-White-1">
        <!-- 카드 해지 -->
        <div
          class="flex justify-between items-center py-[2rem] px-[2.4rem] cursor-pointer"
          @click="goToCardRemove"
        >
          <span class="Body00 text-Black-1">카드 해지</span>
          <ChevronRight class="w-[1.2rem] h-[1.2rem] text-Gray-5" />
        </div>

        <!-- 해지 모달 -->
        <card-delete-modal
          :is-open="showDeleteModal"
          @close="showDeleteModal = false"
          @confirm="handleCardDelete"
        />
      </div>
    </template>
  </layout>
</template>
