<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import WalletReorderItem from '@/components/common/wallet/WalletItem.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'

interface WalletCard {
  id: number
  name: string
  balance: number
  bgColorClass: string
}

const cards = ref<WalletCard[]>([
  {
    id: 1,
    name: '통합지갑',
    balance: 39400,
    bgColorClass: 'bg-[#F6E3A2] text-black',
  },
  {
    id: 2,
    name: '울산페이',
    balance: 39400,
    bgColorClass: 'bg-[#77C3E4] text-white',
  },
  {
    id: 3,
    name: '강릉페이',
    balance: 39400,
    bgColorClass: 'bg-[#C89E59] text-white',
  },
  {
    id: 4,
    name: '부산페이',
    balance: 39400,
    bgColorClass: 'bg-[#F1F1F1] text-black',
  },
])

const saveOrder = () => {
  console.log('순서 저장 로직 구현')
}
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="'순서변경'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="px-4 py-6">
        <!-- 카드 영역 -->
        <div class="flex-1 overflow-y-auto px-4 pt-6">
          <div class="mb-4 Body04 text-Black2">지갑 순서를 바꿔보세요</div>

          <div class="flex flex-col gap-4 pb-6">
            <WalletReorderItem
              v-for="card in cards"
              :key="card.id"
              :name="card.name"
              :balance="card.balance"
              :bgColorClass="card.bgColorClass"
              :showMenu="card.name !== '통합지갑'"
            />
          </div>
        </div>

        <div class="mt-6">
          <danji-button variant="large" @click="saveOrder">저장하기</danji-button>
        </div>
      </div>
    </template>
  </Layout>
</template>
