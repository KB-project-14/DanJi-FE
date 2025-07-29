<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { CircleAlert } from 'lucide-vue-next'

import Layout from '@/components/layout/Layout.vue'
import ExchangeTabs from '@/components/wallet/exchange/ExchangeTab.vue'
import ExchangeCash from '@/components/wallet/exchange/ExchangeCash.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'

// URL param으로 id 가져오기
const route = useRoute()
const cardId = Number(route.params.id)

// 더미 카드 데이터
const cards = [
  {
    id: 1,
    name: '동백전',
    balance: 32000,
    backgroundImageUrl: '/',
    order: 3,
    benefit_type: '캐시백',
    percentage: 10,
  },
  {
    id: 2,
    name: '서울Pay',
    balance: 15000,
    backgroundImageUrl: '/',
    order: 1,
    benefit_type: '캐시백',
    percentage: 5,
  },
  {
    id: 3,
    name: '강원상품권',
    balance: 25000,
    backgroundImageUrl: '/',
    order: 2,
    benefit_type: '인센티브',
    percentage: 7,
  },
  {
    id: 4,
    name: '부산Pay',
    balance: 25000,
    backgroundImageUrl: '/',
    order: 4,
    benefit_type: '인센티브',
    percentage: 8,
  },
]

// id로 해당 카드 찾기
const selectedCard = computed(() => cards.find((c) => c.id === cardId))

// 환전 시 표시할 값
const chargedAmount = computed(() => selectedCard.value?.balance || 0)
const incentiveAmount = computed(() =>
  selectedCard.value
    ? Math.floor(selectedCard.value.balance * (selectedCard.value.percentage / 100))
    : 0,
)

// 탭
const activeTab = ref(0)
const tabs = ['지역 → 지역', '지역 → 현금']
const handleTabChange = (index: number) => (activeTab.value = index)

const exchangeInput = ref<number | null>(null)
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="'환전하기'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <div class="min-h-full flex flex-col justify-between bg-Background">
        <div class="min-h-full flex flex-col bg-Background">
          <!-- 탭 -->
          <div class="pr-[1.8rem] pl-[1.8rem] pt-[1rem]">
            <exchange-tabs :tabs="tabs" :activeIndex="activeTab" @change="handleTabChange" />
          </div>

          <div
            class="flex items-center justify-end pt-[1rem] pr-[2rem] pb-[1rem] gap-1 text-right text-Gray-7"
          >
            <CircleAlert class="w-4 h-4" />
            <span>환전 시 수수료 1%가 부과됩니다.</span>
          </div>

          <!-- 환전 카드 -->
          <div class="flex-1 overflow-y-auto px-[1.8rem]">
            <exchange-cash
              v-if="selectedCard"
              :balance="selectedCard.balance"
              :chargedAmount="chargedAmount"
              :incentiveAmount="incentiveAmount"
              :cardName="selectedCard.name"
            />
          </div>

          <!-- 버튼 -->
          <div class="p-[1.8rem] pt-[2rem]">
            <danji-button
              variant="large"
              class="w-full whitespace-nowrap text-center"
              :disabled="!exchangeInput"
            >
              환전하기
            </danji-button>
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>
