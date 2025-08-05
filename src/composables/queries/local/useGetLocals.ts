import { useQuery } from '@tanstack/vue-query'
import { get } from '@/api/api'
import { LOCAL_KEYS } from '@/constants/QueryKey'
import type { localResponseDtoType } from '@/types/local/localTypes'

export const getLocals = async (): Promise<localResponseDtoType[]> => {
  const response = await get<localResponseDtoType[]>('/api/regions', {
    params: {
      hasLocalCurrency: true,
    },
  })
  return response.data.data
}

const useGetLocals = () => {
  const { data } = useQuery<localResponseDtoType[]>({
    queryKey: LOCAL_KEYS.all,
    queryFn: getLocals,
    staleTime: 1000 * 60,
  })

  return data ?? []
}

export default useGetLocals
