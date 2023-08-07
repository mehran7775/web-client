import { AxiosError } from 'axios'
import { Error } from '~/types'

export function ErrorExtractor(error: AxiosError): Error {
  const res: Error = {
    code: (error.response && error.response.status) ?? 500,
    detail: []
  }

  if (error.response && error.response.data) {
    const data = error.response.data
    res.detail = data.detail ?? []
  }

  return res
}
