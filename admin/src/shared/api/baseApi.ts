import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const SESSION_TAGS = ['MyAccessRequest', 'AccessRequests'] as const;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Me', ...SESSION_TAGS],
  endpoints: () => ({}),
});
