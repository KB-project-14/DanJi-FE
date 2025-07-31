<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Layout from '@/components/layout/Layout.vue'
import { useScrollLock } from '@vueuse/core'
import axios from 'axios'

import MapHeader from '@/components/map/MapHeader.vue'
import MapFilters from '@/components/map/MapFilters.vue'
import KakaoMapContainer from '@/components/map/KaKaoMapContainer.vue'
import LocalStoreListModal from '@/components/map/LocalStoreListModal.vue'
import LocalFilterModal from '@/components/common/modal/LocalFilterModal.vue'

import type { LocalStore } from '@/types/types'

const isLocked = useScrollLock(document.body)
isLocked.value = true

const foldLocalStoreModal = ref<boolean>(true)

const userCurrentLatitude = ref<number>(37.5665)
const userCurrentLongitude = ref<number>(126.978)

const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const error = '위치 정보가 지원되지 않는 브라우저입니다.'
      reject(new Error(error))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userCurrentLatitude.value = position.coords.latitude
        userCurrentLongitude.value = position.coords.longitude

        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        console.log('현재 위치 업데이트:', coords)
        resolve(coords)
      },
      (error) => {
        let errorMessage: string
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 정보 접근이 거부되었습니다.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            break
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
            break
          default:
            errorMessage = '알 수 없는 오류가 발생했습니다.'
        }

        console.error('위치 정보 오류:', error)
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  })
}

const localStores = ref<LocalStore[]>([])

const fetchLocalData = async (): Promise<LocalStore[]> => {
  try {
    const response = await axios.get('/api/local/store')
    localStores.value = response.data.data.localStores

    console.log(`가맹점 데이터 로드 완료: ${localStores.value.length}개`)
    return localStores.value
  } catch (err) {
    const errorMessage = '가맹점 데이터를 불러오는데 실패했습니다.'
    console.error('가맹점 데이터 로드 실패:', err)
    throw new Error(errorMessage)
  }
}

const selectedFilter = ref<string>('전체')
const selectedRegion = ref<string>('강원도')
const selectedCity = ref<string>('강릉')
const isFilterModalVisible = ref<boolean>(false)

/**
 * 선택된 필터에 따라 가맹점을 필터링
 */
const filteredStores = computed((): LocalStore[] => {
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
}

/**
 * 필터 모달 확인 핸들러
 */
const handleFilterModalConfirm = (region: string, city: string): void => {
  selectedRegion.value = region
  selectedCity.value = city
  isFilterModalVisible.value = false
  foldLocalStoreModal.value = false

  // TODO: 지역별 가맹점 필터링 로직 추가
}

const handleCurrentLocationBtnClick = (): void => {
  foldLocalStoreModal.value = true

  // 이미 위치 정보가 있으면 현재 위치로 이동 로직 실행
  if (userCurrentLatitude.value !== 37.5665 || userCurrentLongitude.value !== 126.978) {
    console.log('현재 위치로 이동:', {
      lat: userCurrentLatitude.value,
      lng: userCurrentLongitude.value,
    })
    // TODO: 지도 이동 로직 추가
  } else {
    // 위치 정보가 없으면 새로 가져오기
    getUserLocation()
      .then(() => {
        console.log('위치 가져오기 완료, 지도 이동 실행')
        // TODO: 지도 이동 로직 추가
      })
      .catch((error) => {
        console.error('위치 가져오기 실패:', error)
      })
  }
}

onMounted(async () => {
  try {
    await Promise.all([fetchLocalData(), getUserLocation()])
  } catch (error) {
    console.error('초기화 중 오류 발생:', error)
  }
})
</script>

<template>
  <Layout header-type="none" :is-bottom-nav="foldLocalStoreModal">
    <template #content>
      <div class="flex flex-col h-full">
        <!-- Header Section -->
        <map-header />

        <!-- Filters Section -->
        <map-filters
          :selected-filter="selectedFilter"
          :selected-city="selectedCity"
          :fold-local-store-modal="foldLocalStoreModal"
          @filter-chip-click="handleFilterChipClick"
          @update:selected-filter="selectedFilter = $event"
        />

        <!-- Map Section -->
        <div class="flex-1 overflow-hidden relative mt-[2.2rem]">
          <kakao-map-container
            :user-latitude="userCurrentLatitude"
            :user-longitude="userCurrentLongitude"
            :filtered-stores="filteredStores"
            @current-location-click="handleCurrentLocationBtnClick"
          />

          <!-- Modals -->
          <local-store-list-modal
            class="absolute bottom-[7rem] z-[300]"
            v-model:is-modal-fold="foldLocalStoreModal"
            :local-store-list="localStores"
          />

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
  </Layout>
</template>
