import type { MeResponse, SigninInput, SignupInput } from '@granat/contracts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/auth' }),
  endpoints: builder => ({
    signin: builder.mutation<undefined, SigninInput>({
      query: credentials => ({
        url: '/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<undefined, SignupInput>({
      query: credentials => ({
        url: '/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    signout: builder.mutation<undefined, undefined>({
      query: () => ({
        url: '/signout',
        method: 'POST',
      }),
    }),
    me: builder.query<MeResponse, undefined>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useSignoutMutation,
  useMeQuery,
} = authApi;
