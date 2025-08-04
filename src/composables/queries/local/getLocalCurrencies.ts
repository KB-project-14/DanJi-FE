import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import type { ApiResponse } from '@/types/wallet/ApiResponse'

export interface LocalCurrencyType {
  local_currency_id: string
  name: string
  benefit_type: string
  percentage: number
  maximum: number
}

// Access Token 하드코딩
const ACCESS_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJpYXQiOjE3NTQwMTE1NDMsImV4cCI6MzMyOTAwMTE1NDMsInVzZXJuYW1lIjoidGVzdGVyIiwicm9sZSI6IlJPTEVfQURNSU4ifQ.6016EI8NsaegS1Zl0y1FwbzoEBTBX5TY6hKKSgK1LtI'

export const getLocalCurrencies = async (): Promise<LocalCurrencyType[]> => {
  const response = await axios.get<ApiResponse<LocalCurrencyType[]>>('/api/regions', {
    headers: {
      Authorization: ACCESS_TOKEN,
    },
  })
  return response.data?.data ?? []
}

const useGetLocalCurrencies = () => {
  const { data } = useQuery<LocalCurrencyType[]>({
    queryKey: ['localCurrencies'],
    queryFn: getLocalCurrencies,
    staleTime: 1000 * 60,
  })

  return data
}

export default useGetLocalCurrencies
