<script setup lang="ts">
import { KakaoMap, KakaoMapMarker, type KakaoMapMarkerImage } from 'vue3-kakao-maps'
import { Search, Plus, Minus, Crosshair } from 'lucide-vue-next'
import DanjiChip from '@/components/common/chip/DanjiChip.vue'
import DanjiChipGroup from '@/components/common/chip/DanjiChipGroup.vue'
import { onMounted, ref } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import type { LocalStore } from '@/types/types'
import LocalStoreListModal from '@/components/map/LocalStoreListModal.vue'
import axios from 'axios'
import { useScrollLock } from '@vueuse/core'
import LocalFilterModal from '@/components/common/modal/LocalFilterModal.vue'
import currentLocationIcon from '@/assets/icons/current-location-marker.svg'

const selectedFilter = ref<string>('전체')
const mapLevel = ref(3)
const foldLocalStoreModal = ref<boolean>(true)
const isFilterModalVisible = ref<boolean>(false)
const localStores = ref<LocalStore[]>([])
const selectedRegion = ref<string>('강원도')
const selectedCity = ref<string>('강릉')
const currentLocationMarkerImage: KakaoMapMarkerImage = {
  imageSrc: currentLocationIcon,
  imageWidth: 80,
  imageHeight: 80,
}

const isLocked = useScrollLock(document.body)
isLocked.value = true

const zoomIn = () => {
  mapLevel.value = Math.max(1, mapLevel.value - 1)
}

const zoomOut = () => {
  mapLevel.value = Math.min(14, mapLevel.value + 1)
}

const handleFilterChipClick = (): void => {
  isFilterModalVisible.value = !isFilterModalVisible.value
}

const handleFilterModalConfirm = (region: string, city: string): void => {
  selectedRegion.value = region
  selectedCity.value = city
  isFilterModalVisible.value = false
  foldLocalStoreModal.value = false
}

const handleCurrentLocationBtnClick = (): void => {
  foldLocalStoreModal.value = true
  getUserLocation()
}

//mock api
const fetchLocalData = async (): Promise<void> => {
  try {
    const response = await axios.get('/api/local/store')
    localStores.value = response.data.data.localStores
  } catch {}
}

const userLatitude = ref<number>(37.5665)
const userLongitude = ref<number>(126.978)
const locationError = ref<string | null>(null)

const getUserLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = '위치 정보가 지원되지 않는 브라우저입니다.'
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLatitude.value = position.coords.latitude
      userLongitude.value = position.coords.longitude
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationError.value = '위치 정보 접근이 거부되었습니다.'
          break
        case error.POSITION_UNAVAILABLE:
          locationError.value = '위치 정보를 사용할 수 없습니다.'
          break
        case error.TIMEOUT:
          locationError.value = '위치 정보 요청 시간이 초과되었습니다.'
          break
        default:
          locationError.value = '알 수 없는 오류가 발생했습니다.'
      }
    },
  )
}

onMounted(() => {
  fetchLocalData()
  getUserLocation()
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
          <danji-chip :is-icon="true" :is-active="true" @click="handleFilterChipClick">{{
            foldLocalStoreModal ? '현재 위치' : selectedCity
          }}</danji-chip>
          <danji-chip-group
            :options="['전체', '음식점', '카페']"
            v-model="selectedFilter"
            class="ms-[1rem]"
          />
        </div>

        <!-- 카카오 맵 -->
        <div class="flex-1 overflow-hidden relative mt-[2.2rem]">
          <kakao-map
            :lat="userLatitude"
            :lng="userLongitude"
            :level="mapLevel"
            :draggable="true"
            width="100%"
            height="100%"
          >
            <kakao-map-marker
              :lat="userLatitude"
              :lng="userLongitude"
              :image="currentLocationMarkerImage"
            />

            <!-- 가맹점 마커들 -->
            <kakao-map-marker
              v-for="store in localStores"
              :key="store.id"
              :lat="parseFloat(store.latitude)"
              :lng="parseFloat(store.longitude)"
              :title="store.name"
            />
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

          <!-- 현재 위치 버튼 -->
          <button
            @click="handleCurrentLocationBtnClick"
            class="absolute bottom-[9rem] z-[200] right-[1.6rem] p-[1.5rem] bg-White-0 rounded-full shadow-lg transition-all duration-300"
          >
            <crosshair :size="15" color="#0062ff" />
          </button>

          <!-- 가맹점 모달 -->
          <local-store-list-modal
            class="absolute bottom-[7rem] z-[300]"
            v-model:is-modal-fold="foldLocalStoreModal"
            :local-store-list="localStores"
          />

          <!-- 지역 필터 모달 -->
          <local-filter-modal
            class="z-[400]"
            :is-visible="isFilterModalVisible"
            :inital-region="selectedRegion"
            :initial-city="selectedCity"
            @close="handleFilterChipClick"
            @confirm="handleFilterModalConfirm"
          />
        </div>
      </div>
    </template>
  </layout>
</template>
