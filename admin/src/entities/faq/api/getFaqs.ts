export const getFaqs = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/faq`)
  if (!response.ok) {
    throw new Error(`Failed to get FAQ (${response.statusText})`)
  }
  return response.json()
}