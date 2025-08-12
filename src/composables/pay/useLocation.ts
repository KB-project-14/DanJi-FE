import { readonly, ref } from 'vue'
import { useMemberStore } from '@/stores/useMemberStore'

interface KakaoAddressResponse {
  documents: Array<{
    address: {
      region_1depth_name: string // 시/도
      region_2depth_name: string // 시/군/구
      region_3depth_name: string // 읍/면/동
    }
    road_address?: {
      region_1depth_name: string
      region_2depth_name: string
      region_3depth_name: string
    }
  }>
}

export const useLocation = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCurrentProvince = async () => {
    const memberStore = useMemberStore()

    try {
      isLoading.value = true
      error.value = null

      // 현재 위치 가져오기
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      })

      const baseUrl = 'https://dapi.kakao.com/v2/local/geo/coord2address.json'
      const params = new URLSearchParams({
        x: position.coords.longitude.toString(),
        y: position.coords.latitude.toString(),
        input_coord: 'WGS84',
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

      const data: KakaoAddressResponse = await response.json()

      if (data.documents.length === 0) {
        throw new Error('주소를 찾을 수 없습니다.')
      }

      // 지역명 추출
      const address = data.documents[0].address
      const { region_1depth_name: r1, region_2depth_name: r2 } = address

      // 서버 DB와 일치하는 지명 매핑
      const regionFullNameMap: Record<string, string> = {
        서울: '서울특별시',
        부산: '부산광역시',
        대구: '대구광역시',
        인천: '인천광역시',
        광주: '광주광역시',
        대전: '대전광역시',
        울산: '울산광역시',
        세종: '세종특별자치시',
        경기: '경기도',
        강원: '강원도',
        충북: '충청북도',
        충남: '충청남도',
        전북: '전라북도',
        전남: '전라남도',
        경북: '경상북도',
        경남: '경상남도',
        제주: '제주특별자치도',
      }

      const fullRegionName = regionFullNameMap[r1] || r1

      const province = fullRegionName

      console.log('현재 위치:', { r1, r2, fullRegionName, province })

      memberStore.setCurrentLocation(province)
      return province
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '위치 정보를 가져올 수 없습니다.'
      error.value = errorMessage
      console.error('위치 정보 조회 오류:', err)
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchCurrentProvince,
  }
}
