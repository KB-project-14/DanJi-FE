<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'

import Layout from '@/components/layout/Layout.vue'
import CardHistoryItemList from '@/components/common/history/CardHistoryItemList.vue'
import { HelpCircle } from 'lucide-vue-next'

// 카드 ID
const route = useRoute()
const cardId = Number(route.params.id)

// 카드 데이터 (추후 API 연동 예정)
const allCards = [
  {
    id: 1,
    name: '동백전',
    balance: 32000,
    benefit: 10000,
    maximum: 500000,
    chargedThisMonth: 100000,
    benefit_type: '캐시백',
    percentage: 10,
  },
  {
    id: 2,
    name: '서울Pay',
    balance: 15000,
    benefit: 5000,
    maximum: 500000,
    chargedThisMonth: 120000,
    benefit_type: '캐시백',
    percentage: 5,
  },
  {
    id: 3,
    name: '강원상품권',
    balance: 25000,
    benefit: 7000,
    maximum: 500000,
    chargedThisMonth: 80000,
    benefit_type: '인센티브',
    percentage: 7,
  },
  {
    id: 4,
    name: '부산Pay',
    balance: 25000,
    benefit: 8000,
    maximum: 500000,
    chargedThisMonth: 70000,
    benefit_type: '인센티브',
    percentage: 8,
  },
]

// 현재 카드 정보
const cardInfo = computed(() => allCards.find((c) => c.id === cardId))

// 거래 내역 더미 데이터
interface HistoryItem {
  comment: string
  amount: number
  afterBalance: number
  direction: 'INCOME' | 'EXPENSE'
  type: 'CHARGE' | 'REFUND' | 'CONVERT' | 'PAYMENT'
  createdAt: string
}

const transaction: HistoryItem[] = [
  {
    comment: '가맹점',
    amount: 10000,
    afterBalance: 91000,
    direction: 'EXPENSE',
    type: 'PAYMENT',
    createdAt: '2025-07-20T10:30:40',
  },
  {
    comment: '단지',
    amount: 500000,
    afterBalance: 501000,
    direction: 'INCOME',
    type: 'CHARGE',
    createdAt: '2025-07-18T10:20:40',
  },
  {
    comment: '단지카페',
    amount: 100000,
    afterBalance: 501000,
    direction: 'EXPENSE',
    type: 'PAYMENT',
    createdAt: '2025-04-18T10:20:40',
  },
]

const showTooltip = ref(false)
const tooltipRef = ref<HTMLElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (
    tooltipRef.value &&
    !tooltipRef.value.contains(target) &&
    iconRef.value &&
    !iconRef.value.contains(target)
  ) {
    showTooltip.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <Layout
    :header-type="'basic'"
    :header-title="cardInfo?.name || '카드 상세'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <!-- 카드 잔액 영역 -->
      <div class="p-[3rem]">
        <div class="flex justify-between items-center mb-[2rem]">
          <!-- 카드 정보 -->
          <div>
            <p class="Body04 text-Black-2">{{ cardInfo?.name }}</p>
            <p class="Head0 text-Black-2">{{ cardInfo?.balance.toLocaleString() }} 원</p>
            <div class="flex items-center gap-2 relative">
              <p class="Body01 text-Black-2">이번 달 혜택 :</p>
              <p class="Body01 text-Blue-0">{{ cardInfo?.benefit.toLocaleString() }}원</p>

              <!-- 툴팁 아이콘 -->
              <HelpCircle
                ref="iconRef"
                class="w-[1.2rem] h-[1.2rem] text-Gray-5 cursor-pointer"
                @click.stop="showTooltip = !showTooltip"
              />

              <!-- 툴팁 -->
              <div
                v-if="showTooltip"
                ref="tooltipRef"
                @click.stop
                class="absolute rounded-md shadow z-50 top-full left-0 mt-[0.5rem] p-[1rem] w-max bg-Black-2 text-White-0 Body04"
              >
                이번달 {{ cardInfo?.name }}의 {{ cardInfo?.benefit_type }}은
                {{ cardInfo?.percentage }} %입니다.
              </div>
            </div>
          </div>

          <!-- 카드 이미지 -->
          <div
            class="relative w-[10rem] aspect-[1000/1586] rounded-xl bg-cover bg-center border border-Gray-3"
            :style="{ backgroundImage: `url('/images/sample-card.png')` }"
          ></div>
        </div>

        <!-- 충전 금액 박스 -->
        <div class="bg-Gray-1 rounded-xl p-[1.4rem] Body00 text-Black-2">
          <div class="flex justify-between mb-[1rem] text-Gray-7">
            <span>이번 달 충전한 금액:</span>
            <span>{{ cardInfo?.chargedThisMonth.toLocaleString() }}원</span>
          </div>
          <div class="flex justify-between mb-[1rem] text-Gray-7">
            <span>충전 최대 한도:</span>
            <span>{{ cardInfo?.maximum.toLocaleString() }}원</span>
          </div>
          <div class="flex justify-between text-Gray-7">
            <span>충전 가능 금액:</span>
            <span>{{ (cardInfo!.maximum - cardInfo!.chargedThisMonth).toLocaleString() }}원</span>
          </div>
        </div>
      </div>

      <!-- 이용 내역 리스트 -->
      <CardHistoryItemList :histories="transaction" />
    </template>
  </Layout>
</template>
