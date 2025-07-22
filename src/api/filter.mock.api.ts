import axios from 'axios'

interface RegionResponse {
  success: boolean
  data: string[]
}

export const getRegions = async (): Promise<string[]> => {
  const response = await axios.get<RegionResponse>(`/api/filter`)
  return response.data.data
}
