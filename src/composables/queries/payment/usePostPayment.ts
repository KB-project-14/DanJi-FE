import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { PAY_KEYS } from '@/constants/QueryKey'
import { post } from '@/api/api'
import { payRequestDtoType, payResponseDtoType } from '@/types/pay/payTypes'

export const postPayment = async (payInfo: payRequestDtoType) => {
  const response = await post<payResponseDtoType>('/api/payment', payInfo)
  return response.data.data
}

const usePostPayment = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: postPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [PAY_KEYS] })
    },
    onError: (error) => {
      console.error('결제 요청 실패', error)
      // 라우팅 연결 예정
    }
  })

  return mutation
}

export default usePostPayment
