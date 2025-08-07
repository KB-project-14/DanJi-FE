import { useQuery } from '@tanstack/vue-query'
import { get } from '@/api/api'
import { LOCAL_STORE_KEYS } from '@/constants/QueryKey'
import type { LocalStoreResponseDTO, LocalStoreQueryParams } from '@/types/store/storeTypes'
import { type Ref, computed } from 'vue'

const getLocalStores = async (query: LocalStoreQueryParams): Promise<LocalStoreResponseDTO[]> => {
  const response = await get<LocalStoreResponseDTO[]>('/api/available-merchants', {
    params: query,
  })

  // 카테고리 빈 문자열인 경우 '기타'로 대체
  const mappedData = response.data.data.map((store) => ({
    ...store,
    category: store.category?.trim() === '' ? '기타' : store.category,
  }))

  return mappedData
}

const useGetLocalStores = (lat: Ref<number>, lng: Ref<number>) => {
  const queryKey = computed(() => LOCAL_STORE_KEYS.byLocation(lat.value, lng.value))

  return useQuery<LocalStoreResponseDTO[]>({
    queryKey,
    queryFn: () => getLocalStores({ latitude: lat.value, longitude: lng.value }),
    staleTime: 1000 * 60,
  })
}

export default useGetLocalStores
