<script setup lang="ts">
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import { Search, Plus, Minus, Crosshair } from 'lucide-vue-next'
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import DanjiChipGroup from '@/components/common/chip/DanjiChipGroup.vue'
import { onMounted, ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import type { LocalStore } from '@/types/types'
import LocalStoreListModal from '@/components/map/LocalStoreListModal.vue'
import axios from 'axios'
import { useScrollLock } from '@vueuse/core'

const coordinate = {
  lat: 33.450701,
  lng: 126.570667,
}

const selectedFilter = ref<string>('전체')
const mapLevel = ref(3)
const foldLocalStoreModal = ref<boolean>(true)
const isFilterModalVisible = ref<boolean>(false)
const localStores = ref<LocalStore[]>([])
const isLocked = useScrollLock(document.body)
isLocked.value = true

const basedLocation = ref<string>('내 위치')

const zoomIn = () => {
  mapLevel.value = Math.max(1, mapLevel.value - 1)
}

const zoomOut = () => {
  mapLevel.value = Math.min(14, mapLevel.value + 1)
}

const handleFilterChipClick = (): void => {
  isFilterModalVisible.value = !isFilterModalVisible.value
  foldLocalStoreModal.value = false
}

//mock api
const fetchLocalData = async (): Promise<void> => {
  try {
    const response = await axios.get('/api/local/store')
    localStores.value = response.data.data.localStores
  } catch {}
}

onMounted(() => {
  fetchLocalData()
})
</script>

<template>
  <layout header-type="none" :is-bottom-nav="foldLocalStoreModal">
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
        <div class="flex ms-[1.6rem] mt-[2.2rem]">
          <danji-chip :is-icon="true" :is-active="true" @click="handleFilterChipClick"
            >현재 위치</danji-chip
          >
          <danji-chip-group
            :options="['전체', '음식점', '카페']"
            v-model="selectedFilter"
            class="ms-[1rem]"
          />
        </div>

        <!-- 카카오 맵 -->
        <div class="flex-1 overflow-hidden relative mt-[2.2rem]">
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
            class="absolute top-[1.7rem] z-[200] right-[1.6rem] p-[1.5rem] bg-White-0 rounded-[0.8rem] shadow-lg"
          >
            <plus :size="15" />
          </button>
          <button
            @click="zoomOut"
            class="absolute top-[6.9rem] z-[200] right-[1.6rem] p-[1.5rem] bg-White-0 rounded-[0.8rem] shadow-lg"
          >
            <minus :size="15" />
          </button>

          <button
            class="absolute bottom-[2rem] z-[200] right-[1.6rem] p-[1.5rem] bg-White-0 rounded-full shadow-lg"
          >
            <crosshair :size="15" color="#0062ff" />
          </button>

          <!-- 가맹점 모달 -->
          <local-store-list-modal
            class="absolute bottom-[7rem] z-[300]"
            v-model:is-modal-fold="foldLocalStoreModal"
            :local-store-list="localStores"
            :based-location="basedLocation"
          />
        </div>
      </div>
    </template>
  </layout>
</template>
