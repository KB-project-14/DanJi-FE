import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/filter', () => {
    return HttpResponse.json([{ label: '경상북도' }, { label: '전라남도' }, { label: '강원도' }])
  }),
]
