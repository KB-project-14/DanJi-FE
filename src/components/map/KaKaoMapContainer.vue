<script setup lang="ts">
import { ref } from 'vue'
import { KakaoMap, KakaoMapMarker, type KakaoMapMarkerImage } from 'vue3-kakao-maps'
import { Plus, Minus, Crosshair } from 'lucide-vue-next'
import currentLocationIcon from '@/assets/icons/current-location-marker.svg'
import type { LocalStore } from '@/types/types'

interface Props {
  userLatitude: number
  userLongitude: number
  filteredStores: LocalStore[]
}

interface Emits {
  (e: 'current-location-click'): void
}

defineProps<Props>()
defineEmits<Emits>()

const mapLevel = ref(3)

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
    >
      <!-- Current Location Marker -->
      <kakao-map-marker
        :lat="userLatitude"
        :lng="userLongitude"
        :image="currentLocationMarkerImage"
        title="현재 위치"
      />

      <!-- Store Markers -->
      <kakao-map-marker
        v-for="store in filteredStores"
        :key="store.id"
        :lat="parseFloat(store.latitude)"
        :lng="parseFloat(store.longitude)"
        :title="store.name"
      />
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
      @click="$emit('current-location-click')"
      class="absolute bottom-[9rem] right-[1.6rem] z-[200] p-[1.5rem] bg-White-0 rounded-full shadow-lg"
      aria-label="현재 위치로 이동"
    >
      <crosshair :size="15" color="#0062ff" />
    </button>
  </div>
</template>
