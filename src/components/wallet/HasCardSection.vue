<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { ref, computed, onMounted, nextTick, defineProps, defineEmits } from 'vue'
import UserCard from '@/components/common/card/UserCard.vue'

import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'

const router = useRouter()

// emit으로 부모에게 index값 보내기
const emit = defineEmits<{ (e: 'slide-change', index: number): void }>()

const orderCardPage = () => {
  router.push('/order')
}

const props = defineProps<{
  cards: WalletResponseDtoType[]
}>()

// 카드 정렬 (displayOrder 기준)
const sortedCards = computed(() => [...props.cards].sort((a, b) => a.displayOrder - b.displayOrder))

const swiperEl = ref<any>(null)
const currentSlideIndex = ref(1)

const onSlideChange = (swiper: any) => {
  currentSlideIndex.value = swiper.activeIndex + 1
  // 부모에게 현재 index값 전달
  emit('slide-change', swiper.activeIndex)
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
    <div class="flex items-center justify-between">
      <!-- 나의 카드 + 순서 바꾸기 버튼 -->
      <div class="Body02 text-Black-2">
        나의 카드 {{ currentSlideIndex }} / {{ sortedCards.length }}개
      </div>
      <button class="pr-20 Body04 text-Gray-4 underline" @click="orderCardPage">순서 바꾸기</button>
    </div>
    <!-- 카드 사진 -->
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
          :key="card.walletId + '-' + index"
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
      <span v-if="sortedCards[currentSlideIndex - 1]">
        {{ sortedCards[currentSlideIndex - 1].localCurrencyId }} 카드 혜택:
        {{ sortedCards[currentSlideIndex - 1] }} 인센티브
        {{ sortedCards[currentSlideIndex - 1].percentage }}%
      </span>
    </div>
  </div>
</template>
