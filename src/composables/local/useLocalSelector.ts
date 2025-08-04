import { computed, ref } from 'vue'
import useGetLocals from '@/composables/queries/local/useGetLocals'

export default function useLocalSelector() {
  const localData = useGetLocals()
  const selectedRegion = ref<string>('')
  const selectedCity = ref<string>('')

  // 도/특별시/광역시 목록 추출 (중복 제거)
  const regionNames = computed(() => {
    if (!localData.value || localData.value.length === 0) return []

    const uniqueProvinces = [...new Set(localData.value.map((item) => item.province))]
    return uniqueProvinces.sort()
  })

  // 선택된 도에 따른 시/구/군 목록
  const cityNames = computed(() => {
    if (!selectedRegion.value || !localData.value || localData.value.length === 0) return []

    const cities = localData.value
      .filter((item) => item.province === selectedRegion.value && item.city !== null)
      .map((item) => item.city as string)

    return [...new Set(cities)].sort()
  })

  // 버튼 비활성화 상태
  const isButtonDisabled = computed(() => {
    return !selectedRegion.value || !selectedCity.value
  })

  // 선택된 지역 정보 가져오기
  const getSelectedRegionData = computed(() => {
    if (!selectedRegion.value || !localData.value || localData.value.length === 0) return null

    if (!selectedCity.value) {
      // 도만 선택된 경우
      return localData.value.find(
        (item) => item.province === selectedRegion.value && item.city === null,
      )
    } else {
      // 도와 시/구/군 모두 선택된 경우
      return localData.value.find(
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
  const setRegion = (province: string, city?: string) => {
    selectedRegion.value = province
    if (city) {
      selectedCity.value = city
    }
  }

  return {
    // 상태
    selectedRegion,
    selectedCity,

    // 계산된 값
    regionNames,
    cityNames,
    isButtonDisabled,
    selectedCityId,
    getSelectedRegionData,

    // 메서드
    resetCity,
    resetSelection,
    setRegion,

    // 원본 데이터 (필요한 경우)
    localData,
  }
}
