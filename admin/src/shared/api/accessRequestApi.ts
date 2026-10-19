/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  AccessRequestDecisionInput,
  AccessRequestDecisionResponse,
  AccessRequestsQuery,
  AccessRequestsResponse,
  MyAccessRequestResponse,
} from '@granat/contracts';

import { baseApi } from './baseApi';

export const accessRequestApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllAccessRequests: builder.query<AccessRequestsResponse, AccessRequestsQuery>({
      query: params => ({
        url: '/access-requests',
        method: 'GET',
        params,
      }),
      providesTags: ['AccessRequests'],
    }),
    getMyAccessRequest: builder.query<MyAccessRequestResponse, void>({
      query: () => ({
        url: '/access-requests/me',
        method: 'GET',
      }),
      providesTags: ['MyAccessRequest'],
    }),
    createAccessRequest: builder.mutation<MyAccessRequestResponse, void>({
      query: () => ({
        url: '/access-requests',
        method: 'POST',
      }),
      invalidatesTags: ['MyAccessRequest'],
    }),
    decideAccessRequest: builder.mutation<
      AccessRequestDecisionResponse,
      AccessRequestDecisionInput & { id: number }
    >({
      query: ({ id, status }) => ({
        url: `/access-requests/${String(id)}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['AccessRequests'],
    }),
  }),
});

export const {
  useGetMyAccessRequestQuery,
  useCreateAccessRequestMutation,
  useGetAllAccessRequestsQuery,
  useDecideAccessRequestMutation,
} = accessRequestApi;
