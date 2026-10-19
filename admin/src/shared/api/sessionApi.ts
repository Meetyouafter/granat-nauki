/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { SessionsResponse } from '@granat/contracts';

import { baseApi } from './baseApi';

export const sessionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getSessions: builder.query<SessionsResponse, void>({
      query: () => ({
        url: '/auth/sessions',
        method: 'GET',
      }),
      providesTags: ['Sessions'],
    }),
    endSession: builder.mutation<undefined, string>({
      query: id => ({
        url: `/auth/sessions/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sessions'],
    }),
    endOtherSessions: builder.mutation<undefined, void>({
      query: () => ({
        url: '/auth/sessions',
        method: 'DELETE',
      }),
      invalidatesTags: ['Sessions'],
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useEndSessionMutation,
  useEndOtherSessionsMutation,
} = sessionApi;
