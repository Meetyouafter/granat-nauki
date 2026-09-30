import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/auth' }),
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (credentials) => ({
        url: '/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: '/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    signout: builder.mutation({
      query: () => ({
        url: '/signout',
        method: 'POST'
      }),
    }),
    me: builder.query({
      query: () => ({
        url: '/me',
        method: 'GET'
      }),
    }),
  })
})

export const {
  useSigninMutation,
  useSignupMutation,
  useSignoutMutation,
  useMeQuery
} = authApi