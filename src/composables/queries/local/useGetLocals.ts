import { useQuery } from '@tanstack/vue-query'
import { get } from '@/api/api'
import { LOCAL_KEYS } from '@/constants/QueryKey'
import type { LocalResponseDTO } from '@/types/local/localTypes'

export const getLocals = async (): Promise<LocalResponseDTO[]> => {
  const response = await get<LocalResponseDTO[]>('/api/regions', {
    params: {
      hasLocalCurrency: true,
    },
  })
  return response.data.data
}

const useGetLocals = () => {
  const { data } = useQuery<LocalResponseDTO[]>({
    queryKey: LOCAL_KEYS.all,
    queryFn: getLocals,
    staleTime: 1000 * 60,
  })

  return data ?? []
}

export default useGetLocals
