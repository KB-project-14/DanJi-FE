import { useQuery } from '@tanstack/vue-query'
import type { ApiResponse } from '@/types/types'
import { get } from '@/api/api'
import { LOCAL_KEYS } from '@/constants/QueryKey'
import type { LocalcurrencyListRequestDTO } from '@/types/local/localTypes'
import type { LocalcurrencyResponseDTO } from '@/types/local/localTypes'
import type { AxiosResponse } from 'axios'
import { computed, type Ref } from 'vue'

export const getLocalCurrencies = async (query: LocalcurrencyListRequestDTO) => {
  const response: AxiosResponse<ApiResponse<LocalcurrencyResponseDTO[]>> = await get(
    '/api/local-currencies',
    { params: query },
  )
  return response.data.data
}

const useGetLocalCurrencies = (query: Ref<LocalcurrencyListRequestDTO>) => {
  const { data } = useQuery<LocalcurrencyResponseDTO[]>({
    queryKey: computed(() => [LOCAL_KEYS.detail, query.value]),
    queryFn: () => getLocalCurrencies(query.value),
    staleTime: 1000 * 60,
  })

  return data ?? []
}

export default useGetLocalCurrencies
