export const ROLES = ['USER', 'ADMIN'] as const
export type Role = (typeof ROLES)[number]

export type UserDto = { id: string; email: string; role: Role }
export type MeResponse = { user: UserDto }
