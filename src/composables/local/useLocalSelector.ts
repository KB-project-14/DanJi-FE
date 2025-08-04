import { computed, ref } from 'vue'
import useGetLocals from '@/composables/queries/local/useGetLocals'

export default function useLocalSelector() {
  const localData = useGetLocals()
  const selectedRegion = ref<string>('')
  const selectedCity = ref<string>('')

  // isActive가 true인 데이터만 필터링
  const activeLocalData = computed(() => {
    if (!localData.value || localData.value.length === 0) return []
    return localData.value
  })

  // 도/특별시/광역시 목록 추출 (isActive가 true인 것만, 중복 제거)
  const regionNames = computed(() => {
    if (!activeLocalData.value || activeLocalData.value.length === 0) return []

    const uniqueProvinces = [...new Set(activeLocalData.value.map((item) => item.province))]
    return uniqueProvinces.sort()
  })

  // 선택된 도에 따른 시/구/군 목록 (isActive가 true이고 city가 null이 아닌 것만)
  const cityNames = computed(() => {
    if (!selectedRegion.value || !activeLocalData.value || activeLocalData.value.length === 0)
      return []

    const cities = activeLocalData.value
      .filter((item) => item.province === selectedRegion.value && item.city !== null)
      .map((item) => item.city as string)

    return [...new Set(cities)].sort()
  })

  // 선택된 지역이 시/구/군 selector를 보여줄지 여부 결정
  const shouldShowCitySelector = computed(() => {
    return cityNames.value.length > 0
  })

  // 버튼 비활성화 상태 - city가 필요한 경우에만 city 체크
  const isButtonDisabled = computed(() => {
    if (!selectedRegion.value) return true

    // city selector가 보여지는 경우에만 city 선택 필수
    if (shouldShowCitySelector.value) {
      return !selectedCity.value
    }

    // city selector가 없는 경우 region만 선택되면 OK
    return false
  })

  // 선택된 지역 정보 가져오기
  const getSelectedRegionData = computed(() => {
    if (!selectedRegion.value || !activeLocalData.value || activeLocalData.value.length === 0)
      return null

    if (!selectedCity.value || !shouldShowCitySelector.value) {
      // 도만 선택된 경우 또는 city selector가 없는 경우
      return activeLocalData.value.find(
        (item) => item.province === selectedRegion.value && item.city === null,
      )
    } else {
      // 도와 시/구/군 모두 선택된 경우
      return activeLocalData.value.find(
        (item) => item.province === selectedRegion.value && item.city === selectedCity.value,
      )
    }
  })

  // 선택된 지역의 id 가져오기
  const selectedCityId = computed(() => {
    return getSelectedRegionData.value?.regionId || null
  })

  // 시/구/군 초기화
  const resetCity = () => {
    selectedCity.value = ''
  }

  // 모든 선택 초기화
  const resetSelection = () => {
    selectedRegion.value = ''
    selectedCity.value = ''
  }

  // 특정 지역 설정 (외부에서 초기값 설정 시 사용)
  const setLocal = (region?: string, city?: string) => {
    selectedRegion.value = region ?? ''

    // city selector가 보여지는 경우에만 city 설정
    if (city && shouldShowCitySelector.value) {
      selectedCity.value = city
    } else {
      selectedCity.value = ''
    }
  }

  const getLocalInfoById = (cityId: number) => {
    const localInfo = computed(() => {
      if (!localData.value || localData.value.length === 0) return null
      const found = localData.value.find((item) => item.regionId === cityId)
      return found
    })

    setLocal(localInfo.value?.province, localInfo.value?.city ?? undefined)

    return localInfo
  }

  return {
    // 상태
    selectedRegion,
    selectedCity,

    // 계산된 값
    regionNames,
    cityNames,
    shouldShowCitySelector,
    isButtonDisabled,
    selectedCityId,

    // 메서드
    resetCity,
    resetSelection,
    setLocal,
    getLocalInfoById,

    // 원본 데이터 (필요한 경우)
    localData,
    activeLocalData, // 새로 추가: 활성화된 데이터만
  }
}
