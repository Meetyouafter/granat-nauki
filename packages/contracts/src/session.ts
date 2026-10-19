export type SessionDto = {
  id: string;
  userAgent: string | null;
  ip: string | null;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
};
export type SessionsResponse = { sessions: SessionDto[] };
