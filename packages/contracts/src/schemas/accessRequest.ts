import { z } from 'zod';

import { ACCESS_REQUEST_DECISIONS, ACCESS_REQUEST_STATUSES } from '../accessRequest';

export const ACCESS_REQUEST_SORT_KEYS = ['createdAt', 'email'] as const;
export const SORT_DIRECTIONS = ['asc', 'desc'] as const;
export const ACCESS_REQUEST_STATUS_FILTERS = ['ALL', ...ACCESS_REQUEST_STATUSES] as const;

export const accessRequestsQuerySchema = z.object({
  sort: z.enum(ACCESS_REQUEST_SORT_KEYS).default('createdAt'),
  direction: z.enum(SORT_DIRECTIONS).default('desc'),
  status: z.enum(ACCESS_REQUEST_STATUS_FILTERS).default('ALL'),
  page: z.coerce.number().int().min(1).default(1),
});

export type AccessRequestsQueryInput = z.input<typeof accessRequestsQuerySchema>;
export type AccessRequestsQuery = z.output<typeof accessRequestsQuerySchema>;
export type AccessRequestSortKey = AccessRequestsQuery['sort'];
export type SortDirection = AccessRequestsQuery['direction'];
export type AccessRequestStatusFilter = AccessRequestsQuery['status'];

export const accessRequestIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const accessRequestDecisionSchema = z.object({
  status: z.enum(ACCESS_REQUEST_DECISIONS),
});

export type AccessRequestDecisionInput = z.infer<typeof accessRequestDecisionSchema>;
