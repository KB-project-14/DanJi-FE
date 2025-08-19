import { useQuery } from '@tanstack/vue-query'
import { ref } from 'vue'
import type { ApiResponse } from '@/types/types'
import { get } from '@/api/api'
import { MYPAGE_KEYS } from '@/constants/QueryKey'
import type { MemberResponseDto } from '@/types/member/memberTypes'
import type { AxiosResponse } from 'axios'

export const getMember = async (): Promise<MemberResponseDto> => {
  const token = localStorage.getItem('accessToken')

  if (!token) {
    throw new Error('No access token available')
  }

  const response: AxiosResponse<ApiResponse<MemberResponseDto>> = await get('api/members/me')
  return response.data.data
}

export const useGetMember = () => {
  const token = localStorage.getItem('accessToken')

  if (!token) {
    return ref(null)
  }

  const { data } = useQuery<MemberResponseDto>({
    queryKey: [MYPAGE_KEYS.all],
    queryFn: getMember,
    staleTime: 1000 * 60,
    retry: false,
  })

  return data
}

export default useGetMember
