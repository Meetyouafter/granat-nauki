import type { UserDto } from '@granat/contracts';

import { useMeQuery } from '@shared/api';

type Session
  = | { status: 'loading' }
    | { status: 'guest' }
    | { status: 'error'; retry: () => void }
    | { status: 'authenticated'; user: UserDto };

export const useSession = (): Session => {
  const { data, error, isLoading, refetch } = useMeQuery();

  if (isLoading) return { status: 'loading' };
  if (error && 'status' in error && error.status === 401) return { status: 'guest' };
  if (data) return { status: 'authenticated', user: data.user };
  return {
    status: 'error',
    retry: () => {
      void refetch();
    },
  };
};
