import { useQuery } from '@tanstack/vue-query'
import type { ApiResponse } from '@/types/types'
import { get } from '@/api/api'
import { MYPAGE_KEYS } from '@/constants/QueryKey'
import type { MemberResponseDto } from '@/types/member/memberTypes'
import type { AxiosResponse } from 'axios'

export const getMember = async (): Promise<MemberResponseDto> => {
  const response: AxiosResponse<ApiResponse<MemberResponseDto>> = await get('/api/members/me')
  return response.data.data
}

export const useGetMember = () => {
  const { data } = useQuery<MemberResponseDto>({
    queryKey: [MYPAGE_KEYS.all],
    queryFn: getMember,
    staleTime: 1000 * 60,
  })

  return data ?? null
}

export default useGetMember
