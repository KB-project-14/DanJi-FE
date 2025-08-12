<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import { useScrollLock } from '@vueuse/core'

import MapHeader from '@/components/map/MapHeader.vue'
import MapFilters from '@/components/map/MapFilters.vue'
import KakaoMapContainer from '@/components/map/KaKaoMapContainer.vue'
import LocalStoreListModal from '@/components/map/LocalStoreListModal.vue'
import LocalFilterModal from '@/components/common/modal/LocalFilterModal.vue'
import useLocalSelector from '@/composables/local/useLocalSelector'
import useGeolocation from '@/composables/map/useGeolocation'

import type { LocalStoreResponseDTO } from '@/types/store/storeTypes'
import useGetLocalStores from '@/composables/queries/local/useGetLocalStores'
import { LOCAL_COORDINATES } from '@/constants/LocalCenterCoordinates'
import LocalStoreDetailItem from '@/components/map/LocalStoreDetailItem.vue'
import type { KakaoPlace } from '@/types/store/kakaoMapTypes'
import useKakaoPlacesSearch from '@/composables/queries/store/useGetKakaoPlaceDetail'

const isLocked = useScrollLock(document.body)
isLocked.value = true

const foldLocalStoreModal = ref<boolean>(true)
const mapRef = ref<InstanceType<typeof KakaoMapContainer> | null>(null)

// 지도 중심 좌표 (가맹점 API 호출용)
const mapLatitude = ref<number>(37.5665)
const mapLongitude = ref<number>(126.978)

// 위치 정보 컴포저블 사용
const { currentLatitude, currentLongitude, isLocationLoading, locationError, getCurrentLocation } =
  useGeolocation()

// 초기화 상태 관리
const isLocationReady = ref<boolean>(false)

// 헤더 검색창 상태 관리
const searchValue = ref<string>('')
const isSearchActive = ref<boolean>(false)

// 위치가 준비된 후에만 가맹점 데이터 요청
const { data } = useGetLocalStores(
  computed(() => (isLocationReady.value ? mapLatitude.value : null)),
  computed(() => (isLocationReady.value ? mapLongitude.value : null)),
)

const localStores = computed(() => data.value ?? [])

const selectedFilter = ref<string>('전체')
const { selectedRegion, selectedCity, setLocal, resetSelection } = useLocalSelector()
const isFilterModalVisible = ref<boolean>(false)
const storeCategories = computed(() => {
  const categories = Array.from(
    new Set(localStores.value.map((store) => store.category).filter(Boolean)),
  )

  if (categories.length === 0) return []
  return ['전체', ...categories]
})

const { findPlaceByCoordinatesAndName } = useKakaoPlacesSearch()

const selectedPlace = ref<KakaoPlace | null>(null)
const showPlaceDetail = ref<boolean>(false)
const selectedPlaceId = ref<string>('')

/**
 * 마커 클릭 핸들러
 */
const handlePlaceMarkerClick = async (payload: {
  lat: number
  lng: number
  name: string
  id: string
}) => {
  const data = findPlaceByCoordinatesAndName(payload.lat, payload.lng, payload.name)
  selectedPlace.value = await data
  showPlaceDetail.value = true
  selectedPlaceId.value = payload.id

  mapRef.value?.panTo(payload.lat, payload.lng)
}

/**
 * 장소 상세 정보 모달 닫기 핸들러
 */
const closePlaceDetail = () => {
  showPlaceDetail.value = false
  selectedPlace.value = null
}

/**
 * 선택된 필터에 따라 가맹점을 필터링
 */
const filteredStores = computed((): LocalStoreResponseDTO[] => {
  if (selectedFilter.value === '전체') {
    return localStores.value
  }
  return localStores.value.filter((store) => store.category === selectedFilter.value)
})

/**
 * 필터 칩 클릭 핸들러
 */
const handleFilterChipClick = (): void => {
  isFilterModalVisible.value = !isFilterModalVisible.value
  showPlaceDetail.value = false
}

/**
 * 필터 모달 확인 핸들러
 */
const handleFilterModalConfirm = (region: string, city: string): void => {
  setLocal(region, city)
  isFilterModalVisible.value = false
  foldLocalStoreModal.value = false

  // 헤더 검색창에 지역명 표시
  const locationName = city || region
  searchValue.value = locationName
  isSearchActive.value = true

  const key = city || region
  const localCoordinates = LOCAL_COORDINATES[key].center
  console.log(localCoordinates)

  // 지역 선택 시 좌표 업데이트 및 가맹점 API 호출 트리거
  mapLatitude.value = localCoordinates.lat
  mapLongitude.value = localCoordinates.lng
  mapRef.value?.panTo(localCoordinates.lat, localCoordinates.lng)
}

/**
 * 현재 위치 버튼 클릭 핸들러
 */
const handleCurrencLocationBtnClick = () => {
  resetSelection()
  foldLocalStoreModal.value = true

  mapLatitude.value = currentLatitude.value
  mapLongitude.value = currentLongitude.value

  searchValue.value = ''
  isSearchActive.value = false
}

/**
 * 이 지역 재검색 버튼 클릭 핸들러
 */
const handleResearchBtnClick = () => {
  if (!mapRef.value) return

  const center = mapRef.value.getMapCenterCoordinates()
  if (center) {
    mapLatitude.value = center?.getLat()!
    mapLongitude.value = center?.getLng()!
  }
}

/**
 * 검색창 초기화 핸들러
 */
const handleSearchClear = () => {
  searchValue.value = ''
  isSearchActive.value = false
  handleCurrencLocationBtnClick()
  mapRef.value?.panTo(mapLatitude.value, mapLongitude.value)
  showPlaceDetail.value = false
}

/**
 * 초기화 함수 - (호출 시간 테스트 -> 순서 로깅)
 */
const initializeApp = async () => {
  try {
    console.log('1. 지역 선택 API 호출 시작')
    // 1. 지역 선택 API 먼저 호출 (useLocalSelector에서 처리)
    await new Promise((resolve) => {
      // 지역 데이터가 로드될 때까지 대기
      setTimeout(resolve, 100)
    })

    console.log('2. 현재 위치 가져오기 시작')
    // 2. 현재 위치 가져오기 (컴포저블 사용)
    const location = await getCurrentLocation()

    console.log('3. 지도 좌표 업데이트')
    // 3. 지도 좌표 업데이트
    mapLatitude.value = location.lat
    mapLongitude.value = location.lng

    console.log('4. 가맹점 API 호출 허용')
    // 4. 가맹점 API 호출 허용
    isLocationReady.value = true
  } catch (error) {
    console.error('초기화 중 오류 발생:', error)
    // 오류 발생 시에도 기본 좌표로 가맹점 API 호출 허용
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
        <!-- Header Section -->
        <map-header
          :search-value="searchValue"
          :is-search-active="isSearchActive"
          @search-clear="handleSearchClear"
        />

        <!-- Filters Section -->
        <map-filters
          :selected-filter="selectedFilter"
          :selected-city="selectedCity !== '' ? selectedCity : selectedRegion"
          :filter-options="storeCategories"
          :fold-local-store-modal="foldLocalStoreModal"
          @filter-chip-click="handleFilterChipClick"
          @update:selected-filter="selectedFilter = $event"
        />

        <!-- Map Section -->
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
              <!-- 위치 오류가 있을 경우 표시 -->
              <p v-if="locationError" class="text-red-500 text-sm mt-2">
                {{ locationError }}
              </p>
            </div>
          </div>

          <kakao-map-container
            ref="mapRef"
            :user-latitude="currentLatitude"
            :user-longitude="currentLongitude"
            :filtered-stores="filteredStores"
            :selected-place-id="selectedPlaceId"
            @current-location="handleCurrencLocationBtnClick"
            @research="handleResearchBtnClick"
            @select-place="handlePlaceMarkerClick"
          />

          <!-- Modals -->
          <local-store-list-modal
            class="absolute bottom-[7rem] z-[300]"
            :is-modal-fold="foldLocalStoreModal || showPlaceDetail"
            :local-store-list="filteredStores"
            @select-place="handlePlaceMarkerClick"
          />

          <local-filter-modal
            class="z-[400]"
            :is-visible="isFilterModalVisible"
            v-model:initial-region="selectedRegion"
            v-model:initial-city="selectedCity"
            @confirm="handleFilterModalConfirm"
          />

          <local-store-detail-item
            class="z-[400]"
            :place="selectedPlace"
            :is-visible="showPlaceDetail"
            @close="closePlaceDetail"
          />
        </div>
      </div>
    </template>
  </Layout>
</template>
