<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import WalletItem from '@/components/common/wallet/WalletItem.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import draggable from 'vuedraggable'

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

// 통합지갑 제외 나머지 카드만 드래그 가능
const otherCards = ref(cards.value.slice(1))

const saveOrder = () => {
  const newOrder = [cards.value[0], ...otherCards.value]
  console.log('저장 로직 구현')
  //   추후에 연동 예정
}
</script>

<template>
  <Layout
    :header-type="'setting'"
    :header-title="'설정'"
    :show-left-icon="true"
    :show-right-icon="true"
    :is-bottom-nav="false"
  >
    <template #content>
      <div class="flex flex-col h-full px-[1.5rem] py-[2rem] bg-Background">
        <div class="flex-1 overflow-y-auto">
          <div class="mb-[1rem] Body04 text-Black2">지갑 순서를 바꿔보세요</div>

          <draggable
            v-model="otherCards"
            item-key="id"
            handle=".drag-handle"
            class="flex flex-col gap-[1rem] pb-[1.5rem] mt-[1rem]"
            animation="200"
            ghost-class="drag-ghost"
          >
            <template #item="{ element }">
              <wallet-item
                :name="element.name"
                :balance="element.balance"
                :bgColorClass="element.bgColorClass"
                :showMenu="true"
              />
            </template>
          </draggable>
        </div>

        <div class="pt-[1rem]">
          <danji-button variant="large" @click="saveOrder">저장하기</danji-button>
        </div>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.drag-ghost {
  opacity: 0.3;
}
</style>
