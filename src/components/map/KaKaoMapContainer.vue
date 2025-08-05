<script setup lang="ts">
import { ref } from 'vue'
import {
  KakaoMap,
  KakaoMapMarker,
  KakaoMapCustomOverlay,
  type KakaoMapMarkerImage,
} from 'vue3-kakao-maps'
import { Plus, Minus, Crosshair } from 'lucide-vue-next'
import currentLocationIcon from '@/assets/icons/current-location-marker.svg'
import type { LocalStore } from '@/types/types'
import LocalStoreMarker from './LocalStoreMarker.vue'

interface Props {
  userLatitude: number
  userLongitude: number
  filteredStores: LocalStore[]
}

interface Emit {
  (e: 'current-location'): void
}

defineProps<Props>()
const emit = defineEmits<Emit>()

const mapLevel = ref(3)
const map = ref<kakao.maps.Map>()

const onLoadKakaoMap = (mapRef: kakao.maps.Map) => {
  map.value = mapRef
}

const panTo = (lat: number, lon: number) => {
  if (map.value) {
    map.value.panTo(new kakao.maps.LatLng(lat, lon))
  }
}

const currentLocationMarkerImage: KakaoMapMarkerImage = {
  imageSrc: currentLocationIcon,
  imageWidth: 80,
  imageHeight: 80,
}

const MIN_ZOOM_LEVEL = 1
const MAX_ZOOM_LEVEL = 14

const zoomIn = () => {
  mapLevel.value = Math.max(MIN_ZOOM_LEVEL, mapLevel.value - 1)
}

const zoomOut = () => {
  mapLevel.value = Math.min(MAX_ZOOM_LEVEL, mapLevel.value + 1)
}

const selectedStore = ref<string>()
</script>

<template>
  <div class="relative w-full h-full">
    <!-- Kakao Map -->
    <kakao-map
      :lat="userLatitude"
      :lng="userLongitude"
      :level="mapLevel"
      :draggable="true"
      width="100%"
      height="100%"
      @onLoadKakaoMap="onLoadKakaoMap"
    >
      <!-- Current Location Marker -->
      <kakao-map-marker
        :lat="userLatitude"
        :lng="userLongitude"
        :image="currentLocationMarkerImage"
        title="현재 위치"
      />

      <!-- Store Markers -->
      <kakao-map-custom-overlay
        v-for="store in filteredStores"
        :key="store.localCurrencyId"
        :lat="store.latitude"
        :lng="store.longitude"
        :title="store.name"
      >
        <local-store-marker
          :local-currency-id="store.localCurrencyId"
          :is-selected="store.name === selectedStore"
          :store-name="store.name"
          @click="selectedStore = store.name"
        />
      </kakao-map-custom-overlay>
    </kakao-map>

    <!-- Map Controls -->
    <div class="absolute flex flex-col gap-2 top-[1.7rem] right-[1.6rem] z-[200]">
      <!-- Zoom In Button -->
      <button
        @click="zoomIn"
        class="p-[1.5rem] bg-White-0 rounded-[0.8rem] shadow-lg"
        aria-label="지도 확대"
      >
        <plus :size="15" />
      </button>

      <!-- Zoom Out Button -->
      <button
        @click="zoomOut"
        class="p-[1.5rem] bg-White-0 rounded-[0.8rem] shadow-lg"
        aria-label="지도 축소"
      >
        <minus :size="15" />
      </button>
    </div>

    <!-- Current Location Button -->
    <button
      @click="
        () => {
          panTo(userLatitude, userLongitude)
          emit('current-location')
        }
      "
      class="absolute bottom-[9rem] right-[1.6rem] z-[200] p-[1.5rem] bg-White-0 rounded-full shadow-lg"
      aria-label="현재 위치로 이동"
    >
      <crosshair :size="15" color="#0062ff" />
    </button>
  </div>
</template>
