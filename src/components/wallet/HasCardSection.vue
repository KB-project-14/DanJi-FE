<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { ref, computed, onMounted, nextTick, defineProps, defineEmits } from 'vue'
import UserCard from '@/components/common/card/UserCard.vue'
import NoCard from '../common/card/NoCard.vue'
import { benefitTypeTextMap } from '@/constants/BenefitMapper'

import type { WalletResponseDtoType } from '@/types/wallet/WalletResponseDtoType'

const router = useRouter()

const props = defineProps<{
  cards: WalletResponseDtoType[]
}>()

const emit = defineEmits<{ (e: 'slide-change', index: number): void }>()

const orderCardPage = () => {
  router.push('/order')
}

const sortedCards = computed(() =>
  props.cards && props.cards.length
    ? [...props.cards].sort((a, b) => a.displayOrder - b.displayOrder)
    : [],
)

const currentIndex = ref(0)
const swiperEl = ref<any>(null)

const totalSlides = computed(() => sortedCards.value.length + 1)

const onSlideChange = (swiper: any) => {
  currentIndex.value = swiper.activeIndex
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
      <div class="Body04 text-Black-2">
        나의 카드
        <span class="text-Gray-7" :class="{ 'opacity-0': currentIndex >= sortedCards.length }">
          {{ currentIndex + 1 }} / {{ sortedCards.length }} 개
        </span>
      </div>

      <button
        class="pr-20 Body04 text-Gray-4 text-right underline"
        :class="{ 'opacity-0': currentIndex >= sortedCards.length }"
        @click="orderCardPage"
      >
        순서 바꾸기
      </button>
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
          :key="card.walletId"
          class="!w-[275px] shrink-0"
        >
          <user-card
            :id="card.walletId"
            :balance="card.balance"
            :backgroundImageUrl="card.backgroundImageUrl || '/images/default-card.png'"
            class="w-full"
          />
        </SwiperSlide>

        <SwiperSlide class="!w-[275px] shrink-0 mr-[4rem]">
          <no-card class="w-full" />
        </SwiperSlide>
      </Swiper>
    </div>

    <div class="w-full text-right pr-20 Body04 text-Gray-4">
      <span v-if="sortedCards.length" :class="{ 'opacity-0': currentIndex >= sortedCards.length }">
        {{ sortedCards[currentIndex]?.localCurrencyName }} 카드 혜택 :
        {{ benefitTypeTextMap[sortedCards[currentIndex]?.benefitType] }}
        {{ sortedCards[currentIndex]?.percentage }}%
      </span>
    </div>
  </div>
</template>
