export const api = async (request: string, method: 'GET' = 'GET') => {
  const response = await fetch(request, {
    method
  })

  if (!response.ok) {
    throw new Error(`Failed to get ${request} with (${response.statusText})`)
  }

  return response.json()
}