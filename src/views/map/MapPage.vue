<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import { useScrollLock } from '@vueuse/core'

import MapHeader from '@/components/map/MapHeader.vue'
import MapFilters from '@/components/map/MapFilters.vue'
import KakaoMapContainer from '@/components/map/KaKaoMapContainer.vue'
import LocalStoreListModal from '@/components/map/LocalStoreListModal.vue'
import LocalFilterModal from '@/components/common/modal/LocalFilterModal.vue'
import LocalStoreDetailItem from '@/components/map/LocalStoreDetailItem.vue'

import useLocalSelector from '@/composables/local/useLocalSelector'
import useGeolocation from '@/composables/map/useGeolocation'
import useGetLocalStores from '@/composables/queries/local/useGetLocalStores'
import useKakaoPlacesSearch from '@/composables/queries/store/useGetKakaoPlaceDetail'
import type { LocalStoreResponseDTO } from '@/types/store/storeTypes'
import type { KakaoPlace } from '@/types/store/kakaoMapTypes'

import { LOCAL_COORDINATES } from '@/constants/LocalCenterCoordinates'

const isLocked = useScrollLock(document.body)
isLocked.value = true

const mapRef = ref<InstanceType<typeof KakaoMapContainer> | null>(null)
const mapLatitude = ref<number>(37.5665)
const mapLongitude = ref<number>(126.978)
const isLocationReady = ref<boolean>(false)

const { currentLatitude, currentLongitude, isLocationLoading, locationError, getCurrentLocation } =
  useGeolocation()

const { data: localStoresData } = useGetLocalStores(
  computed(() => (isLocationReady.value ? mapLatitude.value : null)),
  computed(() => (isLocationReady.value ? mapLongitude.value : null)),
)

const localStores = computed(() => localStoresData.value ?? [])
const selectedFilter = ref<string>('전체')

const filteredStores = computed((): LocalStoreResponseDTO[] => {
  if (selectedFilter.value === '전체') {
    return localStores.value
  }
  return localStores.value.filter((store) => store.category === selectedFilter.value)
})

const storeCategories = computed(() => {
  const categories = Array.from(
    new Set(localStores.value.map((store) => store.category).filter(Boolean)),
  )
  return categories.length === 0 ? [] : ['전체', ...categories]
})

const searchValue = ref<string>('')
const isSearchActive = ref<boolean>(false)
const isFilterModalVisible = ref<boolean>(false)

const { selectedRegion, selectedCity, setLocal, resetSelection } = useLocalSelector()

const foldLocalStoreModal = ref<boolean>(true)
const showPlaceDetail = ref<boolean>(false)
const selectedPlace = ref<KakaoPlace | null>(null)
const selectedPlaceId = ref<string>('')

const { findPlaceByCoordinatesAndName } = useKakaoPlacesSearch()

const handlePlaceSelect = async (payload: {
  lat: number
  lng: number
  name: string
  id: string
}) => {
  try {
    const placeData = await findPlaceByCoordinatesAndName(payload.lat, payload.lng, payload.name)

    selectedPlace.value = placeData
    selectedPlaceId.value = payload.id
    showPlaceDetail.value = true

    mapRef.value?.panTo(payload.lat, payload.lng)
  } catch (error) {
    alert('장소 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.')
  }
}

const handleClosePlace = () => {
  showPlaceDetail.value = false
  selectedPlace.value = null
  selectedPlaceId.value = ''
}

const handleFilterToggle = () => {
  isFilterModalVisible.value = !isFilterModalVisible.value
  if (isFilterModalVisible.value) {
    handleClosePlace()
  }
}

const handleLocationSelect = (region: string, city: string) => {
  setLocal(region, city)
  isFilterModalVisible.value = false
  foldLocalStoreModal.value = false

  const locationName = city || region
  searchValue.value = locationName
  isSearchActive.value = true

  const key = city || region
  const coordinates = LOCAL_COORDINATES[key].center

  mapLatitude.value = coordinates.lat
  mapLongitude.value = coordinates.lng
  mapRef.value?.panTo(coordinates.lat, coordinates.lng)
}

const handleCurrentLocation = () => {
  resetSelection()
  foldLocalStoreModal.value = true

  mapLatitude.value = currentLatitude.value
  mapLongitude.value = currentLongitude.value

  searchValue.value = ''
  isSearchActive.value = false

  handleClosePlace()
}

const handleResearch = () => {
  const center = mapRef.value?.getMapCenterCoordinates()
  if (center) {
    mapLatitude.value = center.getLat()
    mapLongitude.value = center.getLng()
  }
}

const handleSearchClear = () => {
  searchValue.value = ''
  isSearchActive.value = false
  handleCurrentLocation()
  mapRef.value?.panTo(mapLatitude.value, mapLongitude.value)
}

const initializeApp = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const location = await getCurrentLocation()

    mapLatitude.value = location.lat
    mapLongitude.value = location.lng

    isLocationReady.value = true
  } catch (error) {
    isLocationReady.value = true
  }
}

onMounted(async () => {
  await initializeApp()
})
</script>

<template>
  <Layout header-type="none" :is-bottom-nav="foldLocalStoreModal">
    <template #content>
      <div class="flex flex-col h-full bg-White-1">
        <map-header
          :search-value="searchValue"
          :is-search-active="isSearchActive"
          @search-clear="handleSearchClear"
        />

        <map-filters
          :selected-filter="selectedFilter"
          :selected-city="selectedCity !== '' ? selectedCity : selectedRegion"
          :filter-options="storeCategories"
          :fold-local-store-modal="foldLocalStoreModal"
          @filter-chip-click="handleFilterToggle"
          @update:selected-filter="selectedFilter = $event"
        />

        <div class="flex-1 overflow-hidden relative mt-[2.2rem]">
          <div
            v-if="!isLocationReady || isLocationLoading"
            class="absolute inset-0 flex items-center justify-center bg-gray-100 z-10"
          >
            <div class="text-center">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"
              ></div>
              <p class="text-gray-600">
                {{ isLocationLoading ? '위치 정보를 가져오는 중...' : '데이터를 불러오는 중...' }}
              </p>
              <p v-if="locationError" class="text-red-500 text-sm mt-2">{{ locationError }}</p>
            </div>
          </div>

          <kakao-map-container
            ref="mapRef"
            :user-latitude="currentLatitude"
            :user-longitude="currentLongitude"
            :filtered-stores="filteredStores"
            :selected-place-id="selectedPlaceId"
            :is-maker-selected="showPlaceDetail"
            @current-location="handleCurrentLocation"
            @research="handleResearch"
            @select-place="handlePlaceSelect"
          />

          <local-store-list-modal
            class="absolute bottom-[7rem] z-[300]"
            :is-modal-fold="foldLocalStoreModal || showPlaceDetail"
            :local-store-list="filteredStores"
            @select-place="handlePlaceSelect"
          />

          <local-filter-modal
            class="z-[400]"
            :is-visible="isFilterModalVisible"
            v-model:initial-region="selectedRegion"
            v-model:initial-city="selectedCity"
            @confirm="handleLocationSelect"
          />

          <local-store-detail-item
            class="z-[400]"
            :place="selectedPlace"
            :is-visible="showPlaceDetail"
            @close="handleClosePlace"
          />
        </div>
      </div>
    </template>
  </Layout>
</template>
