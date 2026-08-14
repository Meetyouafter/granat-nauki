export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const api = async (request: string, method: 'GET' = 'GET') => {
  const response = await fetch(request, {
    method
  })

  if (!response.ok) {
    throw new ApiError(response.status, `Failed to get ${request} with (${response.statusText})`)
  }

  return response.json()
}
