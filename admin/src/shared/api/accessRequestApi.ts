/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  AccessRequestDecisionInput,
  AccessRequestDecisionResponse,
  AccessRequestsQuery,
  AccessRequestsResponse,
  MyAccessRequestResponse,
} from '@granat/contracts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const accessRequestApi = createApi({
  reducerPath: 'accessRequestApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/access-requests' }),
  tagTypes: ['MyAccessRequest', 'AccessRequests'],
  endpoints: builder => ({
    getAllAccessRequests: builder.query<AccessRequestsResponse, AccessRequestsQuery>({
      query: params => ({
        url: '',
        method: 'GET',
        params,
      }),
      providesTags: ['AccessRequests'],
    }),
    getMyAccessRequest: builder.query<MyAccessRequestResponse, void>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
      providesTags: ['MyAccessRequest'],
    }),
    createAccessRequest: builder.mutation<MyAccessRequestResponse, void>({
      query: () => ({
        url: '',
        method: 'POST',
      }),
      invalidatesTags: ['MyAccessRequest'],
    }),
    decideAccessRequest: builder.mutation<
      AccessRequestDecisionResponse,
      AccessRequestDecisionInput & { id: number }
    >({
      query: ({ id, status }) => ({
        url: `/${String(id)}`,
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
