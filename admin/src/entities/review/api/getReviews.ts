import { api } from '@shared/api'

import type { ReviewDto } from '../model/types'

export const getReviews = async (): Promise<{ data: ReviewDto[] }> => {
  const response = await api(`${import.meta.env.VITE_API_URL}/reviews`, 'GET')
  return response
}
