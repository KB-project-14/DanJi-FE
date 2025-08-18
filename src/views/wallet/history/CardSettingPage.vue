<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Layout from '@/components/layout/Layout.vue'
import { ChevronRight } from 'lucide-vue-next'
import CardDeleteModal from '@/components/common/modal/CardDeleteModal.vue'

import useDeleteWallet from '@/composables/queries/wallet/useDeleteWallet'
import { useUiStore } from '@/stores/useUiStore'

const router = useRouter()
const route = useRoute()

const walletId = route.params.walletId as string
const { mutate: deleteWallet } = useDeleteWallet()

const showDeleteModal = ref(false)

const goToCardRemove = () => {
  showDeleteModal.value = true
}

const handleCardDelete = () => {
  if (!walletId) {
    useUiStore().setNextToast({
      type: 'error',
      msg: '해당 카드는 존재하지 않습니다. ',
      opts: { autoClose: 800, position: 'bottom-center' },
    })
    return
  }

  deleteWallet(walletId, {
    onSuccess: async () => {
      showDeleteModal.value = false
      useUiStore().setNextToast({
        type: 'success',
        msg: '카드가 해지되었습니다.',
        opts: {
          autoClose: 1500,
          position: 'bottom-center',
          hideProgressBar: true,
          closeButton: false,
        },
      })
      await router.push('/home')
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
      <div class="flex flex-col bg-White-1 h-full">
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
