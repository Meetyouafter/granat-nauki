export const getFaqs = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/faq`)
  if (!response.ok) {
    throw new Error(`Failed to get FAQ (${response.statusText})`)
  }
  return response.json()
}

export interface SaveFaqItem {
  title: string
  description: string
  id?: number
}

export const saveFaqs = async (items: SaveFaqItem[]) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/faq`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!response.ok) {
    throw new Error(`Failed to save FAQ (${response.statusText})`)
  }
  return response.json()
}