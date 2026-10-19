/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  ChangePasswordInput,
  MeResponse,
  SigninInput,
  SignupInput,
} from '@granat/contracts';

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
    changePassword: builder.mutation<undefined, ChangePasswordInput>({
      query: body => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Sessions'],
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
  useChangePasswordMutation,
  useMeQuery,
} = authApi;
