import { getErrorMessage, useSignoutMutation } from '@shared/api';
import {
  useCreateAccessRequestMutation,
  useGetMyAccessRequestQuery,
} from '@shared/api/accessRequestApi';
import { useSession } from '@shared/utils/useSession';

export const useAccessRequest = () => {
  const session = useSession();
  const [signout, { isLoading: isSigningOut }] = useSignoutMutation();
  const {
    data: myAccessRequest,
    isLoading: isAccessRequestLoading,
    error: accessRequestError,
    refetch,
  } = useGetMyAccessRequestQuery();
  const [
    createAccessRequest,
    { isLoading: isCreating, error: createError },
  ] = useCreateAccessRequestMutation();

  const status = myAccessRequest?.status ?? null;
  const canRequest = status === null || status === 'REJECTED';

  const handleRetry = () => {
    void refetch();
  };

  const handleSignout = () => {
    void signout();
  };

  const submit = async () => {
    try {
      await createAccessRequest().unwrap();
    } catch {
      // ошибку показывает createErrorMessage из состояния мутации
    }
  };

  return {
    session,
    status,
    canRequest,
    isAccessRequestLoading,
    hasLoadError: Boolean(accessRequestError),
    isCreating,
    createErrorMessage: getErrorMessage(createError),
    isSigningOut,
    handleRequestAccess: submit,
    handleSignout,
    handleRetry,
  };
};
