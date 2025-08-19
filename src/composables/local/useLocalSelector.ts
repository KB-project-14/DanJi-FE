import { computed, ref } from 'vue'
import useGetLocals from '@/composables/queries/local/useGetLocals'

export default function useLocalSelector() {
  const localData = useGetLocals()
  const selectedRegion = ref<string>('')
  const selectedCity = ref<string>('')

  const activeLocalData = computed(() => {
    if (!localData.value || localData.value.length === 0) return []
    return localData.value
  })

  const regionNames = computed(() => {
    if (!activeLocalData.value || activeLocalData.value.length === 0) return []

    const uniqueProvinces = [...new Set(activeLocalData.value.map((item) => item.province))]
    return uniqueProvinces.sort()
  })

  const cityNames = computed(() => {
    if (!selectedRegion.value || !activeLocalData.value || activeLocalData.value.length === 0)
      return []

    const cities = activeLocalData.value
      .filter((item) => item.province === selectedRegion.value && item.city !== null)
      .map((item) => item.city as string)

    return [...new Set(cities)].sort()
  })

  const shouldShowCitySelector = computed(() => {
    return cityNames.value.length > 0
  })

  const isButtonDisabled = computed(() => {
    if (!selectedRegion.value) return true

    if (shouldShowCitySelector.value) {
      return !selectedCity.value
    }

    return false
  })

  const getSelectedRegionData = computed(() => {
    if (!selectedRegion.value || !activeLocalData.value || activeLocalData.value.length === 0)
      return null

    if (!selectedCity.value || !shouldShowCitySelector.value) {
      return activeLocalData.value.find(
        (item) => item.province === selectedRegion.value && item.city === null,
      )
    } else {
      return activeLocalData.value.find(
        (item) => item.province === selectedRegion.value && item.city === selectedCity.value,
      )
    }
  })

  const selectedCityId = computed(() => {
    return getSelectedRegionData.value?.regionId || null
  })

  const resetCity = () => {
    selectedCity.value = ''
  }

  const resetSelection = () => {
    selectedRegion.value = ''
    selectedCity.value = ''
  }

  const setLocal = (region?: string, city?: string) => {
    selectedRegion.value = region ?? ''
    selectedCity.value = city ?? ''
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
    selectedRegion,
    selectedCity,
    regionNames,
    cityNames,
    shouldShowCitySelector,
    isButtonDisabled,
    selectedCityId,

    resetCity,
    resetSelection,
    setLocal,
    getLocalInfoById,

    localData,
    activeLocalData,
  }
}
