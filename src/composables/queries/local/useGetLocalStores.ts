import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { LocalStoreResponseDTO } from '@/types/store/storeTypes'

// API 함수 (실제 구현에 맞게 수정)
const fetchLocalStores = async (lat: number, lng: number): Promise<LocalStoreResponseDTO[]> => {
  // 실제 API 호출 로직
  const response = await fetch(`/api/stores?lat=${lat}&lng=${lng}`)
  return response.json()
}

export default function useGetLocalStores(
  latitude: Ref<number | null>,
  longitude: Ref<number | null>,
) {
  return useQuery({
    queryKey: ['localStores', latitude, longitude],
    queryFn: () => {
      if (latitude.value === null || longitude.value === null) {
        throw new Error('좌표가 설정되지 않았습니다.')
      }
      return fetchLocalStores(latitude.value, longitude.value)
    },
    enabled: computed(() => latitude.value !== null && longitude.value !== null),
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    gcTime: 10 * 60 * 1000, // 10분간 메모리 보관
  })
}
