export interface LocalStoreQueryParams {
  category?: string
  latitude?: number
  longitude?: number
  localCurrencyName?: string
  name?: string
}

export interface LocalStoreResponseDTO {
  createdAt: string
  updatedAt: string
  availableMerchantId: string
  name: string
  address: string
  latitude: number
  longitude: number
  category: string
  localCurrencyId: string
  localCurrencyName: string
  distance: number
}

export interface ClusteredStore {
  key: string
  latitude: number
  longitude: number
  stores: LocalStoreResponseDTO[]
}
