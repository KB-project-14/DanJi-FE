import { http, HttpResponse } from 'msw'
import { localData } from './data/local'
import { localStoreData } from './data/localStore'

export const handlers = [
  http.get('/api/local/list', () => {
    return HttpResponse.json(localData)
  }),

  http.get('/api/local/store', () => {
    return HttpResponse.json(localStoreData)
  }),
]
