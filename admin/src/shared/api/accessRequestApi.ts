/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  AccessRequestsQuery,
  AccessRequestsResponse,
  MyAccessRequestResponse,
} from '@granat/contracts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const accessRequestApi = createApi({
  reducerPath: 'accessRequestApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/access-requests' }),
  tagTypes: ['MyAccessRequest'],
  endpoints: builder => ({
    getAllAccessRequests: builder.query<AccessRequestsResponse, AccessRequestsQuery>({
      query: params => ({
        url: '',
        method: 'GET',
        params,
      }),
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
  }),
});

export const {
  useGetMyAccessRequestQuery,
  useCreateAccessRequestMutation,
  useGetAllAccessRequestsQuery,
} = accessRequestApi;
