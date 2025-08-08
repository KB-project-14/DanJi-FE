import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { PAY_KEYS } from '@/constants/QueryKey'
import { post } from '@/api/api'
import type { payRequestDtoType, payResponseDtoType } from '@/types/pay/payTypes'

export const postPayment = async (payInfo: payRequestDtoType) => {
  const response = await post<payResponseDtoType[]>('/api/payment', payInfo)
  return response.data.data
}

const usePostPayment = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: postPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PAY_KEYS.all })
      console.log('결제 요청 성공', data)
      // store 업데이트 처리 추후 추가 예정
    },
    onError: (error) => {
      console.error('결제 요청 실패', error)
      // 라우팅 연결 예정
    },
  })

  return {
    makePayment: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  }
}

export default usePostPayment
