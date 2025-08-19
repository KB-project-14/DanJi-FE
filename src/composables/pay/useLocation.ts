import { readonly, ref } from 'vue'
import { useMemberStore } from '@/stores/useMemberStore'

interface KakaoAddressResponse {
  documents: Array<{
    address: {
      region_1depth_name: string
      region_2depth_name: string
      region_3depth_name: string
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

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              reject(
                new Error(
                  '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.',
                ),
              )
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              reject(new Error('위치 정보를 사용할 수 없습니다.'))
            } else if (error.code === error.TIMEOUT) {
              reject(new Error('위치 정보 요청 시간이 초과되었습니다.'))
            } else {
              reject(new Error('위치 정보를 가져올 수 없습니다.'))
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
          },
        )
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

      const address = data.documents[0].address
      const { region_1depth_name: r1, region_2depth_name: r2 } = address

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

      memberStore.setCurrentLocation(province)
      return province
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '위치 정보를 가져올 수 없습니다.'
      error.value = errorMessage
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
