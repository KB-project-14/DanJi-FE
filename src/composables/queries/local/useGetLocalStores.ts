import { get } from '@/api/api'
import { LOCAL_STORE_KEYS } from '@/constants/QueryKey'
import type { LocalStoreResponseDTO, LocalStoreQueryParams } from '@/types/store/storeTypes'
import { type Ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const getLocalStores = async (query: LocalStoreQueryParams): Promise<LocalStoreResponseDTO[]> => {
  const response = await get<LocalStoreResponseDTO[]>('api/available-merchants', {
    params: query,
  })

  const mappedData = response.data.data.map((store) => ({
    ...store,
    category: store.category?.trim() === '' ? '기타' : store.category,
  }))

  return mappedData
}

const useGetLocalStores = (lat: Ref<number | null>, lng: Ref<number | null>) => {
  const queryKey = computed(() =>
    lat.value !== null && lng.value !== null
      ? LOCAL_STORE_KEYS.byLocation(lat.value, lng.value)
      : ['localStores', 'disabled'],
  )

  return useQuery<LocalStoreResponseDTO[]>({
    queryKey,
    queryFn: () => {
      if (lat.value === null || lng.value === null) {
        throw new Error('위치 정보가 없습니다.')
      }
      return getLocalStores({ latitude: lat.value, longitude: lng.value })
    },
    enabled: computed(() => lat.value !== null && lng.value !== null),
    staleTime: 1000 * 60,
    retry: false,
  })
}

export default useGetLocalStores
