import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ResponseType } from '../types/types'

// [TODO] 체크 필요
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.log('Query onError')
      console.log(error, query.meta)

      handleAxiosError(error)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context) => {
      console.log('Mutation onError')
      console.log(error)

      handleAxiosError(error)
    },
  }),
})

function isAxiosError(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined
}

function handleAxiosError(error: any) {
  if (isAxiosError(error) && error.response) {
    const errorCode = error.response.data as ResponseType<string>
    const errorMessage = (error.response.data as ResponseType<string>).message

    if (errorCode) {
      error.message = `[${errorCode}] ${errorMessage}`
    }
  }
}

export default queryClient
