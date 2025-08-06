<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import { ChevronRight } from 'lucide-vue-next'
import CardDeleteModal from '@/components/common/modal/CardDeleteModal.vue'

import useDeleteWallet from '@/composables/queries/wallet/deleteWallet'

const { mutate: deleteWallet } = useDeleteWallet()

// 예: 버튼 클릭 시 호출
const handleDelete = (walletId: string) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    deleteWallet(walletId)
  }
}

const showDeleteModal = ref(false)

const goToCardRemove = () => {
  showDeleteModal.value = true
}

// 해지
const handleCardDelete = () => {
  console.log('카드 해지 API 호출')
  showDeleteModal.value = false
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
