<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import {
  KakaoMap,
  KakaoMapMarker,
  KakaoMapCustomOverlay,
  type KakaoMapMarkerImage,
} from 'vue3-kakao-maps'
import { Plus, Minus, Crosshair, RotateCcw } from 'lucide-vue-next'
import currentLocationIcon from '@/assets/icons/current-location-marker.svg'
import type { ClusteredStore, LocalStoreResponseDTO } from '@/types/store/storeTypes'
import LocalStoreMarker from './LocalStoreMarker.vue'

interface Props {
  userLatitude: number
  userLongitude: number
  filteredStores: LocalStoreResponseDTO[]
}

interface Emit {
  (e: 'current-location'): void
  (e: 'research'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const mapLevel = ref(3)
const map = ref<kakao.maps.Map>()
const showResearchButton = ref<Boolean>(false)
const selectedCluster = ref<string>()
const selectedStore = ref<string>()

// 좌표가 동일한지 확인하는 함수 (소수점 6자리까지 비교)
const isSameLocation = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const precision = 0.000001 // 약 10cm 정밀도
  return Math.abs(lat1 - lat2) < precision && Math.abs(lng1 - lng2) < precision
}

// 매장들을 좌표별로 클러스터링
const clusteredStores = computed(() => {
  const clusters: ClusteredStore[] = []
  const processed = new Set<string>()

  props.filteredStores.forEach((store) => {
    const storeId = store.availableMerchantId
    if (processed.has(storeId)) return

    // 동일한 좌표의 다른 매장들 찾기
    const sameLocationStores = props.filteredStores.filter((otherStore) =>
      isSameLocation(store.latitude, store.longitude, otherStore.latitude, otherStore.longitude),
    )

    // 처리된 것으로 마킹
    sameLocationStores.forEach((s) => processed.add(s.availableMerchantId))

    // 클러스터 생성
    const clusterKey = `${store.latitude.toFixed(6)}_${store.longitude.toFixed(6)}`
    clusters.push({
      key: clusterKey,
      latitude: store.latitude,
      longitude: store.longitude,
      stores: sameLocationStores,
    })
  })

  return clusters
})

const mapEventListeners: any[] = []

const onLoadKakaoMap = (mapRef: kakao.maps.Map) => {
  map.value = mapRef
  const zoomListener = (window as any).kakao.maps.event.addListener(mapRef, 'zoom_changed', () => {
    const newLevel = mapRef.getLevel()
    mapLevel.value = newLevel
  })
  const dragListener = (window as any).kakao.maps.event.addListener(mapRef, 'dragend', () => {
    showResearchButton.value = true
  })

  mapEventListeners.push(zoomListener, dragListener)
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

const getMapCenterCoordinates = () => map.value?.getCenter()

const handleClusterClick = (cluster: ClusteredStore) => {
  if (cluster.stores.length === 1) {
    // 단일 매장인 경우 바로 선택
    selectedStore.value = cluster.stores[0].availableMerchantId
    selectedCluster.value = undefined
  } else {
    // 다중 매장인 경우 클러스터 선택 토글
    if (selectedCluster.value === cluster.key) {
      selectedCluster.value = undefined
    } else {
      selectedCluster.value = cluster.key
      selectedStore.value = undefined
    }
  }
}

const handleStoreSelect = (store: LocalStoreResponseDTO) => {
  selectedStore.value = store.name
  selectedCluster.value = undefined
}

// 클릭된 클러스터의 매장들
const selectedClusterStores = computed(() => {
  if (!selectedCluster.value) return []
  const cluster = clusteredStores.value.find((c) => c.key === selectedCluster.value)
  return cluster?.stores || []
})

defineExpose({
  panTo,
  getMapCenterCoordinates,
})

onUnmounted(() => {
  mapEventListeners.forEach((listener) => {
    ;(window as any).kakao.maps.event.removeListener(listener)
  })
})
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

      <!-- Clustered Store Markers -->
      <kakao-map-custom-overlay
        v-for="cluster in clusteredStores"
        :key="cluster.key"
        :lat="cluster.latitude"
        :lng="cluster.longitude"
        :title="
          cluster.stores.length === 1 ? cluster.stores[0].name : `${cluster.stores.length}개 매장`
        "
      >
        <local-store-marker
          :cluster="cluster"
          :is-selected="
            selectedCluster === cluster.key ||
            (cluster.stores.length === 1 && selectedStore === cluster.stores[0].availableMerchantId)
          "
          :map-level="mapLevel"
          @click="handleClusterClick(cluster)"
        />
      </kakao-map-custom-overlay>
    </kakao-map>

    <!-- 클러스터 선택 시 매장 목록 표시 -->
    <div
      v-if="selectedCluster && selectedClusterStores.length > 1"
      class="absolute bottom-[15rem] left-[1.6rem] right-[1.6rem] z-[300] bg-White-0 rounded-[1.2rem] shadow-xl max-h-[20rem] overflow-hidden"
    >
      <div class="p-[1.6rem] border-b border-Gray-1">
        <h3 class="Head02 text-Black-1">이 위치의 매장들</h3>
        <p class="Body03 text-Gray-5 mt-[0.4rem]">선택할 매장을 클릭하세요</p>
      </div>
      <div class="max-h-[12rem] overflow-y-auto">
        <div
          v-for="store in selectedClusterStores"
          :key="store.availableMerchantId"
          class="px-[1.6rem] py-[1.2rem] border-b border-Gray-1 last:border-b-0 cursor-pointer hover:bg-Gray-1 transition-colors"
          @click="handleStoreSelect(store)"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="Head04 text-Black-1">{{ store.name }}</p>
            </div>
            <div class="w-[1.2rem] h-[1.2rem] rounded-full bg-White-1"></div>
          </div>
        </div>
      </div>
    </div>

    <span
      v-if="showResearchButton"
      class="absolute flex flex-row items-center top-[1rem] left-1/2 -translate-x-1/2 z-[200] px-[1rem] py-[0.8rem] bg-White-1 Body03 text-Gray-8 rounded-[2rem] shadow-xl cursor-pointer"
      @click="
        () => {
          showResearchButton = false
          emit('research')
        }
      "
    >
      <rotate-ccw class="me-[0.5rem]" :size="16" />
      이 지역 재검색
    </span>

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
