import type { KakaoPlace, KakaoPlacesResponse } from '@/types/store/kakaoMapTypes'
import { ref } from 'vue'

export default function useKakaoPlacesSearch() {
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  /**
   * 특정 좌표와 장소명으로 정확한 장소 정보 찾기
   */
  const findPlaceByCoordinatesAndName = async (
    latitude: number,
    longitude: number,
    placeName: string,
  ): Promise<KakaoPlace | null> => {
    if (!placeName.trim()) {
      throw new Error('장소명을 입력해주세요.')
    }

    isLoading.value = true
    error.value = null

    try {
      const baseUrl = 'https://dapi.kakao.com/v2/local/search/keyword.json'
      const params = new URLSearchParams({
        query: placeName,
        x: longitude.toString(),
        y: latitude.toString(),
        radius: '100', // 100m 반경
        size: '5',
        sort: 'distance',
      })

      const response = await fetch(`${baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data: KakaoPlacesResponse = await response.json()

      // 가장 가까운 장소 반환
      return data.documents.length > 0 ? data.documents[0] : null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.'
      error.value = errorMessage
      console.error('카카오 장소 검색 오류:', err)
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 상태
    isLoading,
    error,

    // 메서드
    findPlaceByCoordinatesAndName,
  }
}
