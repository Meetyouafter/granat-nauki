import { api } from '@shared/api'

import type { ReviewDto } from '../model/types'

export const getReview = async (id: string): Promise<{ data: ReviewDto }> => {
  const response = await api(`${import.meta.env.VITE_API_URL}/reviews/${id}`, 'GET')
  return response
}
