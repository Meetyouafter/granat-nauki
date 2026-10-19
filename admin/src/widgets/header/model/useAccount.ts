import { useSignoutMutation } from '@shared/api';
import { useSession } from '@shared/utils/useSession';

export const useAccount = () => {
  const session = useSession();
  const [signout, { isLoading: isSigningOut }] = useSignoutMutation();

  const handleSignout = () => {
    void signout();
  };

  return {
    email: session.status === 'authenticated' ? session.user.email : null,
    isSigningOut,
    handleSignout,
  };
};
