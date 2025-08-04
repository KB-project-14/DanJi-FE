<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { ref, computed, onMounted, nextTick, defineProps, defineEmits } from 'vue'
import UserCard from '@/components/common/card/UserCard.vue'

import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'

const router = useRouter()

// 부모에서 내려오는 카드 props
const props = defineProps<{
  cards: WalletResponseDtoType[]
}>()

// 부모에게 슬라이드 변경 이벤트 전달
const emit = defineEmits<{ (e: 'slide-change', index: number): void }>()

const orderCardPage = () => {
  router.push('/order')
}

// displayOrder 기준 오름차순 정렬
const sortedCards = computed(() =>
  props.cards && props.cards.length
    ? [...props.cards].sort((a, b) => a.displayOrder - b.displayOrder)
    : [],
)

// 현재 슬라이드 index
const currentIndex = ref(0)

const swiperEl = ref<any>(null)

const onSlideChange = (swiper: any) => {
  currentIndex.value = swiper.activeIndex
  emit('slide-change', swiper.activeIndex) // 부모에게도 전달
}

onMounted(() => {
  nextTick(() => {
    swiperEl.value?.swiper?.update()
    swiperEl.value?.swiper?.slideTo(0)
  })
})
</script>

<template>
  <div class="flex flex-col gap-4 max-w-full overflow-hidden">
    <!-- 순서 바꾸기 버튼 -->
    <div class="flex items-center justify-end">
      <button class="pr-20 Body04 text-Gray-4 underline" @click="orderCardPage">순서 바꾸기</button>
    </div>

    <!-- 카드 슬라이더 -->
    <div class="overflow-hidden">
      <Swiper
        ref="swiperEl"
        :slides-per-view="'auto'"
        :space-between="20"
        :slides-per-group="1"
        :centered-slides="false"
        class="w-full"
        @slideChange="onSlideChange"
      >
        <SwiperSlide
          v-for="(card, index) in sortedCards"
          :key="card.walletId"
          class="!w-[275px] shrink-0"
        >
          <UserCard
            :id="card.walletId"
            :balance="card.balance"
            :backgroundImageUrl="card.backgroundImageUrl || '/images/default-card.png'"
            class="w-full"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- 혜택 안내 -->
    <div class="w-full text-right pr-20 Body04 text-Gray-4">
      <span v-if="sortedCards.length">
        {{ sortedCards[currentIndex]?.localCurrencyId }} 카드 혜택 :
        {{ sortedCards[currentIndex]?.benefitType }}
        {{ sortedCards[currentIndex]?.percentage }}%
      </span>
    </div>
  </div>
</template>
