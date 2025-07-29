<script setup lang="ts">
import { ref } from 'vue'
import { CircleAlert } from 'lucide-vue-next'

import Layout from '@/components/layout/Layout.vue'
import ExchangeTabs from '@/components/wallet/exchange/ExchangeTab.vue'
import ExchageCard from '@/components/wallet/exchange/ExchageCard.vue'
import DanjiButton from '@/components/common/button/DanjiButton.vue'
import ExchangeCash from '@/components/wallet/exchange/ExchangeCash.vue'

// 탭
const activeTab = ref(0)
const tabs = ['지역 → 지역', '지역 → 현금']
const handleTabChange = (index: number) => (activeTab.value = index)

// 더미 데이터
const balance = 303000
const chargedAmount = 300000
const incentiveAmount = 3000

const selectedCard = ref('')
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
          <!-- 상단 영역 (헤더 밑) -->
          <div class="pr-[1.8rem] pl-[1.8rem] pt-[1rem]">
            <exchange-tabs :tabs="tabs" :activeIndex="activeTab" @change="handleTabChange" />
          </div>
          <div
            class="flex items-center justify-end pt-[1rem] pr-[2rem] pb-[1rem] gap-1 text-right text-Gray-7"
          >
            <CircleAlert class="w-4 h-4" />
            <span>환전 시 수수료 1%가 부과됩니다.</span>
          </div>
          <!-- 중간 콘텐츠 -->
          <div class="flex-1 overflow-y-auto px-[1.8rem]">
            <div v-if="activeTab === 0">
              <exchage-card
                :balance="balance"
                :chargedAmount="chargedAmount"
                :incentiveAmount="incentiveAmount"
                cardName="동백전"
              />
            </div>
            <div v-else>
              <exchange-cash
                :balance="balance"
                :chargedAmount="chargedAmount"
                :incentiveAmount="incentiveAmount"
                cardName="동백전"
              />
            </div>
          </div>

          <!-- 하단 버튼 -->
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
