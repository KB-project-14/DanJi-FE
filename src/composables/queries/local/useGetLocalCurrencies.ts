import { useQuery } from '@tanstack/vue-query'
import type { ApiResponse } from '@/types/types'
import { get } from '@/api/api'
import { LOCAL_KEYS } from '@/constants/QueryKey'
import type { localcurrencyListRequestDtoType } from '@/types/local/localTypes'
import type { localcurrencyResponseDtoType } from '@/types/local/localTypes'
import type { AxiosResponse } from 'axios'

export const getLocalCurrencies = async (
  query: localcurrencyListRequestDtoType,
): Promise<localcurrencyResponseDtoType[]> => {
  const response: AxiosResponse<ApiResponse<localcurrencyResponseDtoType[]>> = await get(
    '/api/local-currencies',
    { params: query },
  )
  return response.data.data
}

const useGetLocalCurrencies = (query: localcurrencyListRequestDtoType) => {
  const { data } = useQuery<localcurrencyResponseDtoType[]>({
    queryKey: LOCAL_KEYS.all,
    queryFn: () => getLocalCurrencies(query),
    staleTime: 1000 * 60,
  })

  return data ?? []
}

export default useGetLocalCurrencies
