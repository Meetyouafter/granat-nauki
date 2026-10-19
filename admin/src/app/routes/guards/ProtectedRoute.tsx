import { Navigate, Outlet } from 'react-router';

import type { Role } from '@granat/contracts';

import { paths } from '@shared/config';
import { ErrorState } from '@shared/ui/ErrorState';
import { useSession } from '@shared/utils/useSession';

import { homeFor } from './homeFor';

const ProtectedRoute = ({ role }: { role?: Role }) => {
  const session = useSession();

  switch (session.status) {
    case 'loading':
      return null;
    case 'error':
      return (
        <ErrorState
          title="Не удалось проверить сессию"
          message="Сервер не ответил. Проверьте соединение и попробуйте ещё раз."
          onRetry={session.retry}
        />
      );
    case 'guest':
      return <Navigate to={paths.signin} replace />;
    case 'authenticated':
      if (role && session.user.role !== role) {
        return <Navigate to={homeFor(session.user.role)} replace />;
      }
      return <Outlet />;
  }
};

export default ProtectedRoute;
