<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
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
  selectedPlaceId: string
  isMakerSelected: boolean
}

interface Emit {
  (e: 'current-location'): void
  (e: 'research'): void
  (e: 'select-place', payload: { lat: number; lng: number; name: string; id: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const mapLevel = ref(3)
const map = ref<kakao.maps.Map>()
const showResearchButton = ref<Boolean>(false)
const selectedCluster = ref<string>()
const selectedStore = ref<string>()

const isSameLocation = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const precision = 0.000001
  return Math.abs(lat1 - lat2) < precision && Math.abs(lng1 - lng2) < precision
}

const clusteredStores = computed(() => {
  const clusters: ClusteredStore[] = []
  const processed = new Set<string>()

  props.filteredStores.forEach((store) => {
    const storeId = store.availableMerchantId
    if (processed.has(storeId)) return

    const sameLocationStores = props.filteredStores.filter((otherStore) =>
      isSameLocation(store.latitude, store.longitude, otherStore.latitude, otherStore.longitude),
    )

    sameLocationStores.forEach((s) => processed.add(s.availableMerchantId))

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
    const store = cluster.stores[0]
    selectedStore.value = store.availableMerchantId
    selectedCluster.value = undefined

    emitPlace(cluster.latitude, cluster.longitude, store.name, store.availableMerchantId)
  } else {
    if (selectedCluster.value === cluster.key) {
      selectedCluster.value = undefined
    } else {
      selectedCluster.value = cluster.key
      selectedStore.value = undefined
    }
  }
}

const handleStoreSelect = (store: LocalStoreResponseDTO) => {
  selectedStore.value = store.availableMerchantId
  selectedCluster.value = undefined

  emitPlace(store.latitude, store.longitude, store.name, store.availableMerchantId)
}

const selectedClusterStores = computed(() => {
  if (!selectedCluster.value) return []
  const cluster = clusteredStores.value.find((c) => c.key === selectedCluster.value)
  return cluster?.stores || []
})

const emitPlace = (lat: number, lng: number, name: string, id: string) => {
  emit('select-place', { lat, lng, name, id })
}

defineExpose({
  panTo,
  getMapCenterCoordinates,
})

onUnmounted(() => {
  mapEventListeners.forEach((listener) => {
    ;(window as any).kakao.maps.event.removeListener(listener)
  })
})

watch(
  () => props.isMakerSelected,
  (on) => {
    if (!on) {
      selectedStore.value = undefined
      selectedCluster.value = undefined
    } else if (props.selectedPlaceId) {
      selectedStore.value = props.selectedPlaceId
    }
  },
)

watch(
  () => props.selectedPlaceId,
  (id) => {
    if (!props.isMakerSelected) return
    selectedStore.value = id
    selectedCluster.value = undefined
  },
)
</script>

<template>
  <div class="relative w-full h-full">
    <kakao-map
      :lat="userLatitude"
      :lng="userLongitude"
      :level="mapLevel"
      :draggable="true"
      width="100%"
      height="100%"
      @onLoadKakaoMap="onLoadKakaoMap"
    >
      <kakao-map-marker
        :lat="userLatitude"
        :lng="userLongitude"
        :image="currentLocationMarkerImage"
        title="현재 위치"
      />

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
            props.isMakerSelected &&
            (selectedCluster === cluster.key ||
              cluster.stores.some((s) => s.availableMerchantId === selectedStore))
          "
          :map-level="mapLevel"
          @click="handleClusterClick(cluster)"
        />
      </kakao-map-custom-overlay>
    </kakao-map>

    <div
      v-if="selectedCluster && selectedClusterStores.length > 1"
      class="absolute bottom-[21rem] left-[1.6rem] right-[1.6rem] z-[450] bg-White-0 rounded-[1.2rem] shadow-xl max-h-[20rem] overflow-hidden"
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

    <div class="absolute flex flex-col gap-2 top-[1.7rem] right-[1.6rem] z-[200]">
      <button
        @click="zoomIn"
        class="p-[1.5rem] bg-White-0 rounded-[0.8rem] shadow-lg"
        aria-label="지도 확대"
      >
        <plus :size="15" />
      </button>

      <button
        @click="zoomOut"
        class="p-[1.5rem] bg-White-0 rounded-[0.8rem] shadow-lg"
        aria-label="지도 축소"
      >
        <minus :size="15" />
      </button>
    </div>

    <button
      @click="
        () => {
          panTo(userLatitude, userLongitude)
          emit('current-location')
        }
      "
      class="absolute bottom-[10rem] right-[1.6rem] z-[200] p-[1.5rem] bg-White-0 rounded-full shadow-lg"
      aria-label="현재 위치로 이동"
    >
      <crosshair :size="15" color="#0062ff" />
    </button>
  </div>
</template>
