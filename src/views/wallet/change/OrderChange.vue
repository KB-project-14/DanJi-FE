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

const isDragMode = ref(false)
const toggleDragMode = () => {
  isDragMode.value = !isDragMode.value
}

const saveOrder = () => {
  const newOrder = [cards.value[0], ...otherCards.value]
  console.log('저장 로직 구현')
}
</script>

<template>
  <layout
    :header-type="'basic'"
    :header-title="'순서변경'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="flex flex-col h-full px-6 py-8">
        <div class="flex-1 overflow-y-auto pt-6">
          <div class="mb-4 Body04 text-Black2">지갑 순서를 바꿔보세요</div>

          <!-- 통합지갑 고정 -->
          <wallet-item
            :name="cards[0].name"
            :balance="cards[0].balance"
            :bgColorClass="cards[0].bgColorClass"
            :showMenu="false"
          />

          <!-- 나머지 드래그 가능 -->
          <draggable
            v-model="otherCards"
            item-key="id"
            handle=".drag-handle"
            class="flex flex-col gap-4 pb-6 mt-4"
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

        <!-- 하단 저장 버튼 -->
        <div class="pt-4 border-t border-gray-200">
          <danji-button variant="large" @click="saveOrder">저장하기</danji-button>
        </div>
      </div>
    </template>
  </layout>
</template>

<style scoped>
.drag-ghost {
  opacity: 0.3;
}
</style>
