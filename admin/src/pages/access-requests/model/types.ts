import type {
  AccessRequestSortKey,
  AccessRequestStatusFilter,
  SortDirection,
} from '@granat/contracts';

export { ACCESS_REQUEST_STATUS_FILTERS as STATUS_FILTERS } from '@granat/contracts';

export type StatusFilter = AccessRequestStatusFilter;
export type SortKey = AccessRequestSortKey;
export type { SortDirection };
export interface SortState {
  key: SortKey;
  direction: SortDirection;
}
