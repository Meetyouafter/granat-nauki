import { Navigate, Outlet } from 'react-router';

import { useSession } from '@shared/utils/useSession';

import { homeFor } from './homeFor';

const GuestRoute = () => {
  const session = useSession();

  if (session.status === 'loading') return null;
  if (session.status === 'authenticated') {
    return <Navigate to={homeFor(session.user.role)} replace />;
  }
  return <Outlet />;
};

export default GuestRoute;
