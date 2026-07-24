export const getFaq = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/faq`)
  if (!response.ok) {
    throw new Error('Failed to fetch FAQ')
  }
  return response.json()
}