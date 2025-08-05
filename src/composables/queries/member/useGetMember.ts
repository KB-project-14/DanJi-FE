import { useQuery } from '@tanstack/vue-query'
import type { ApiResponse } from '@/types/types'
import { get } from '@/api/api'
import { MYPAGE_KEYS } from '@/constants/QueryKey'
import type { memberResponseDtoType } from '@/types/member/memberTypes'
import type { AxiosResponse } from 'axios'

export const getMember = async (): Promise<memberResponseDtoType> => {
  const response: AxiosResponse<ApiResponse<memberResponseDtoType>> = await get('/api/members/me')
  return response.data.data
}

export const useGetMember = () => {
  const { data } = useQuery<memberResponseDtoType>({
    queryKey: [MYPAGE_KEYS.all],
    queryFn: getMember,
    staleTime: 1000 * 60,
  })

  return data ?? null
}

export default useGetMember
