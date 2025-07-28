<script setup lang="ts">
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import { Search, Plus, Minus, Crosshair } from 'lucide-vue-next'
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import DanjiChipGroup from '@/components/common/chip/DanjiChipGroup.vue'
import { ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'

const coordinate = {
  lat: 33.450701,
  lng: 126.570667,
}

const selectedFilter = ref<string>('전체')
const mapLevel = ref(3)

const zoomIn = () => {
  mapLevel.value = Math.max(1, mapLevel.value - 1)
}

const zoomOut = () => {
  mapLevel.value = Math.min(14, mapLevel.value + 1)
}
</script>

<template>
  <layout header-type="none" :is-bottom-nav="true">
    <template #content>
      <div class="flex flex-col h-full">
        <!-- 검색창 -->
        <div
          class="flex mt-[1.6rem] mx-[1.6rem] px-[2.1rem] py-[0.8rem] bg-Gray-0 Body02 rounded-[2.5rem] border-2 border-Gray-1"
        >
          <search :size="20" color="#a3a3a3" :stroke-width="1.25" />
          <input
            placeholder="가맹점명, 주소를 검색하세요"
            class="w-full ms-[1rem] bg-Gray-0 focus:outline-none focus:border-Gray-3 focus:ring-0 transition-colors"
          />
        </div>

        <!-- 필터 -->
        <div class="flex mx-[1.6rem] mt-[2.2rem]">
          <danji-chip :is-icon="true" :is-active="true">강릉</danji-chip>
          <danji-chip-group
            :options="['전체', '음식점', '카페']"
            v-model="selectedFilter"
            class="ms-[1rem] me-[1rem]"
          />
        </div>

        <!-- 카카오 맵 -->
        <div class="flex-1 relative mt-[2.2rem]">
          <kakao-map
            :lat="coordinate.lat"
            :lng="coordinate.lng"
            :level="mapLevel"
            :draggable="true"
            width="100%"
            height="100%"
          >
            <kakao-map-marker :lat="coordinate.lat" :lng="coordinate.lng"></kakao-map-marker>
          </kakao-map>
          <button
            @click="zoomIn"
            class="absolute top-[1.7rem] z-[1000] right-[1.6rem] p-[1.5rem] bg-white rounded-[0.8rem] shadow-lg"
          >
            <plus :size="15" />
          </button>
          <button
            @click="zoomOut"
            class="absolute top-[6.9rem] z-[1000] right-[1.6rem] p-[1.5rem] bg-white rounded-[0.8rem] shadow-lg"
          >
            <minus :size="15" />
          </button>

          <button
            class="absolute bottom-[2rem] z-[1000] right-[1.6rem] p-[1.5rem] bg-white rounded-full shadow-lg"
          >
            <crosshair :size="15" color="#0062ff" />
          </button>
        </div>
      </div>
    </template>
  </layout>
</template>
