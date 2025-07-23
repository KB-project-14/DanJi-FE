<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { ref, computed, onMounted, nextTick } from 'vue'
import UserCard from '@/components/common/card/UserCard.vue'

interface Card {
  id: number
  balance: number
  backgroundImageUrl: string
  order: number
}

const cards = ref<Card[]>([
  { id: 1, balance: 32000, backgroundImageUrl: '/', order: 3 },
  { id: 2, balance: 15000, backgroundImageUrl: '/', order: 1 },
  { id: 3, balance: 25000, backgroundImageUrl: '/', order: 2 },
  { id: 4, balance: 25000, backgroundImageUrl: '/', order: 4 },
  { id: 5, balance: 25000, backgroundImageUrl: '/', order: 5 },
  { id: 6, balance: 25000, backgroundImageUrl: '/', order: 6 },
])

const sortedCards = computed(() => [...cards.value].sort((a, b) => a.order - b.order))

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
      <div class="Body02 text-Gray-6">
        나의 카드 {{ currentSlideIndex }} / {{ sortedCards.length }}개
      </div>
      <button class="Body04 text-Gray-6 underline pr-20">순서 바꾸기</button>
    </div>

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
  </div>
</template>
