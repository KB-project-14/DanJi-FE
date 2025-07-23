<script setup lang="ts">
import Layout from '@/components/layout/Layout.vue'
import WalletItem from '@/components/common/wallet/WalletItem.vue'
// 더미 데이터
interface WalletCard {
  id: number
  name: string
  balance: number
  bgColorClass: string
}

const cards: WalletCard[] = [
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
]
</script>
<template>
  <layout
    :header-type="'basic'"
    :header-title="'나의 총 자산'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="flex flex-col h-full px-[1.5rem] py-[2rem] bg-background gap-4">
        <wallet-item
          v-for="card in cards"
          :key="card.id"
          :name="card.name"
          :balance="card.balance"
          :bgColorClass="card.bgColorClass"
          :showMenu="false"
        />
      </div>
    </template>
  </layout>
</template>

<style scoped></style>
