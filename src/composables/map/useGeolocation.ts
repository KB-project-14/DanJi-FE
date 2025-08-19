import { ref } from 'vue'

export default function useGeolocation() {
  const currentLatitude = ref<number>(33.515555)
  const currentLongitude = ref<number>(126.513179)
  const isLocationLoading = ref<boolean>(false)
  const locationError = ref<string | null>(null)

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = '위치 정보가 지원되지 않는 브라우저입니다.'
        locationError.value = error
        reject(new Error(error))
        return
      }

      isLocationLoading.value = true
      locationError.value = null

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          currentLatitude.value = coords.lat
          currentLongitude.value = coords.lng
          isLocationLoading.value = false

          resolve(coords)
        },
        (error) => {
          isLocationLoading.value = false

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

          locationError.value = errorMessage
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    })
  }

  const getCurrentLocationForJeju = (): Promise<{ lat: number; lng: number }> => {
    return Promise.resolve({
      lat: currentLatitude.value,
      lng: currentLongitude.value,
    })
  }

  const resetToDefaultLocation = () => {
    currentLatitude.value = 37.5665
    currentLongitude.value = 126.978
    locationError.value = null
  }

  return {
    currentLatitude,
    currentLongitude,
    isLocationLoading,
    locationError,

    getCurrentLocation,
    resetToDefaultLocation,
    getCurrentLocationForJeju,
  }
}
