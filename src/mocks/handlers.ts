import { http, HttpResponse } from 'msw'
import { localData } from './data/local'

export const handlers = [
  http.get('/api/local/list', () => {
    return HttpResponse.json(localData)
  }),
]
