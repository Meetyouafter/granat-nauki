/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { MeResponse, SigninInput, SignupInput } from '@granat/contracts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/auth' }),
  tagTypes: ['Me'],
  endpoints: builder => ({
    signin: builder.mutation<undefined, SigninInput>({
      query: credentials => ({
        url: '/signin',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Me'],
    }),
    signup: builder.mutation<undefined, SignupInput>({
      query: credentials => ({
        url: '/signup',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Me'],
    }),
    signout: builder.mutation<undefined, void>({
      query: () => ({
        url: '/signout',
        method: 'POST',
      }),
      invalidatesTags: ['Me'],
    }),
    me: builder.query<MeResponse, void>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
      providesTags: ['Me'],
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useSignoutMutation,
  useMeQuery,
} = authApi;
