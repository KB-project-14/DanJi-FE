<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import CardHistoryItemList from '@/components/common/history/CardHistoryItemList.vue'

const cardInfo = ref({
  name: '부산지역화폐',
  balance: 101000,
  benefit: 10000,
  maximum: 500000,
  chargedThisMonth: 100000,
})

const transaction = [
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
]
</script>

<template>
  <layout
    :header-type="'basic'"
    :header-title="'카드이름'"
    :is-bottom-nav="false"
    :showLeftIcon="true"
  >
    <template #content>
      <!-- 카드 잔액 영역 -->
      <!-- 카드 잔액 영역 -->
      <div class="p-[3rem]">
        <div class="flex justify-between items-center mb-[2rem]">
          <!-- 왼쪽: 카드 정보 -->
          <div>
            <p class="Body04 text-Black-2">{{ cardInfo.name }}</p>
            <p class="Head0 text-Black-2">{{ cardInfo.balance.toLocaleString() }} 원</p>
            <div class="flex items-center gap-2">
              <p class="Body01 text-Black-2">이번 달 혜택 :</p>
              <p class="Body01 text-Blue-0">{{ cardInfo.benefit.toLocaleString() }}원</p>
            </div>
          </div>

          <!-- 오른쪽: 카드 이미지 -->
          <div
            class="relative w-[10rem] aspect-[1000/1586] rounded-xl bg-cover bg-center border border-Gray-3"
            :style="{ backgroundImage: `url('/images/sample-card.png')` }"
          ></div>
        </div>

        <!-- 충전 금액 박스 -->
        <div class="bg-Gray-1 rounded-xl p-[1.4rem] Body00 text-Black-2">
          <div class="flex justify-between mb-[1rem] text-Gray-7">
            <span>이번 달 충전한 금액:</span>
            <span>{{ cardInfo.chargedThisMonth.toLocaleString() }}원</span>
          </div>
          <div class="flex justify-between mb-[1rem] text-Gray-7">
            <span>충전 최대 한도:</span>
            <span>{{ cardInfo.maximum.toLocaleString() }}원</span>
          </div>
          <div class="flex justify-between text-Gray-7">
            <span>충전한 가능 금액:</span>
            <span>{{ (cardInfo.maximum - cardInfo.chargedThisMonth).toLocaleString() }}원</span>
          </div>
        </div>
      </div>

      <!-- 이용 내역 리스트 -->
      <CardHistoryItemList :histories="transaction" />
    </template>
  </layout>
</template>
