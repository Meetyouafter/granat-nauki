import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { getErrorCode } from './getErrorCode';

export const SESSION_TAGS = ['MyAccessRequest', 'AccessRequests', 'Sessions'] as const;

const SESSION_LOST_CODES = new Set(['UNAUTHORIZED', 'FORBIDDEN']);

const rawBaseQuery = fetchBaseQuery({ baseUrl: '/api' });

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args, api, extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const code = getErrorCode(result.error);

  if (code && SESSION_LOST_CODES.has(code) && api.endpoint !== 'me') {
    api.dispatch(baseApi.util.invalidateTags(['Me']));
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Me', ...SESSION_TAGS],
  endpoints: () => ({}),
});
