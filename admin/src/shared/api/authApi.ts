/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { MeResponse, SigninInput, SignupInput } from '@granat/contracts';

import { baseApi, SESSION_TAGS } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    signin: builder.mutation<undefined, SigninInput>({
      query: credentials => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Me', ...SESSION_TAGS],
    }),
    signup: builder.mutation<undefined, SignupInput>({
      query: credentials => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Me', ...SESSION_TAGS],
    }),
    signout: builder.mutation<undefined, void>({
      query: () => ({
        url: '/auth/signout',
        method: 'POST',
      }),
      invalidatesTags: ['Me'],
    }),
    me: builder.query<MeResponse, void>({
      query: () => ({
        url: '/auth/me',
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
