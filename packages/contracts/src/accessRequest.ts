import type { AccessRequestsQuery } from './schemas/accessRequest';

export const ACCESS_REQUEST_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;

export type AccessRequestStatus = (typeof ACCESS_REQUEST_STATUSES)[number];

export const ACCESS_REQUEST_DECISIONS = [
  'APPROVED',
  'REJECTED',
] as const satisfies readonly AccessRequestStatus[];
export type AccessRequestDecision = (typeof ACCESS_REQUEST_DECISIONS)[number];

export type AccessRequestDto = { status: AccessRequestStatus; createdAt: string };
export type MyAccessRequestResponse = {
  status: AccessRequestStatus | null; createdAt: string | null;
};

export type AccessRequestListItem = {
  id: number;
  status: AccessRequestStatus;
  createdAt: string;
  updatedAt: string;
  user: { id: number; email: string };
  decidedBy: { id: number; email: string } | null;
};
export type AccessRequestsResponse = {
  data: AccessRequestListItem[];
  params: AccessRequestsQuery;
  total: number;
  totalPages: number;
};

export type AccessRequestDecisionResponse = { accessRequest: AccessRequestListItem };
