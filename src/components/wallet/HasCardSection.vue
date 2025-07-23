<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { ref, computed, onMounted, nextTick, defineProps } from 'vue'
import UserCard from '@/components/common/card/UserCard.vue'

interface Card {
  id: number
  name: string
  balance: number
  backgroundImageUrl: string
  order: number
  benefit_type: string
  percentage: number
}

// ✅ props로 cards 받기
const props = defineProps<{
  cards: Card[]
}>()

const sortedCards = computed(() => [...props.cards].sort((a, b) => a.order - b.order))
const swiperEl = ref<any>(null)
const currentSlideIndex = ref(1)

const onSlideChange = (swiper: any) => {
  currentSlideIndex.value = swiper.activeIndex + 1
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
      <button class="pr-20 Body04 text-Gray-4 underline">순서 바꾸기</button>
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
          :key="card.id + '-' + index"
          class="!w-[275px] shrink-0"
        >
          <UserCard
            :balance="card.balance"
            :backgroundImageUrl="card.backgroundImageUrl"
            class="w-full"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- 혜택 안내 -->
    <div class="w-full text-right pr-20 Body04 text-Gray-4">
      <span v-if="sortedCards[currentSlideIndex - 1]">
        {{ sortedCards[currentSlideIndex - 1].name }}의 혜택 :
        {{ sortedCards[currentSlideIndex - 1].benefit_type }}
        {{ sortedCards[currentSlideIndex - 1].percentage }}%
      </span>
    </div>
  </div>
</template>
