import { useSearchParams } from 'react-router';

import { accessRequestsQuerySchema, type AccessRequestsResponse } from '@granat/contracts';

import {
  useGetAllAccessRequestsQuery,
} from '@shared/api/accessRequestApi';

import type { SortDirection, SortKey, StatusFilter } from './types';

const NO_REQUESTS: AccessRequestsResponse['data'] = [];
const DEFAULT_QUERY = accessRequestsQuerySchema.parse({});

export const useAccessRequest = () => {
  const [urlParams, navigateTo] = useSearchParams();

  const parsedQuery = accessRequestsQuerySchema.safeParse(Object.fromEntries(urlParams));
  const query = parsedQuery.success ? parsedQuery.data : DEFAULT_QUERY;

  const {
    data,
    isLoading: isAccessRequestLoading,
    isFetching: isAccessRequestFetching,
    error: accessRequestError,
  } = useGetAllAccessRequestsQuery(query);

  const handleSort = (sort: SortKey, direction: SortDirection) => {
    urlParams.set('sort', sort);
    urlParams.set('direction', direction);
    urlParams.delete('page');
    navigateTo(`?${urlParams.toString()}`);
  };

  // ALL — значение по умолчанию, в URL его не пишем
  const handleStatusFilter = (status: StatusFilter) => {
    if (status === 'ALL') urlParams.delete('status');
    else urlParams.set('status', status);
    urlParams.delete('page');
    navigateTo(`?${urlParams.toString()}`);
  };

  // Первая страница — значение по умолчанию, в URL её не пишем
  const handlePageChange = (page: number) => {
    if (page === 1) urlParams.delete('page');
    else urlParams.set('page', String(page));
    navigateTo(`?${urlParams.toString()}`);
  };

  return {
    accessRequests: data?.data ?? NO_REQUESTS,
    total: data?.total ?? 0,
    page: query.page,
    totalPages: data?.totalPages ?? 0,
    statusFilter: query.status,
    sort: { key: query.sort, direction: query.direction },
    isAccessRequestLoading,
    isAccessRequestFetching,
    hasLoadError: Boolean(accessRequestError),
    handleSort,
    handleStatusFilter,
    handlePageChange,
  };
};
