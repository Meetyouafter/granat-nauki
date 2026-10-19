import { useState } from 'react';

import type { SessionsResponse } from '@granat/contracts';

import {
  getErrorMessage,
  useEndOtherSessionsMutation,
  useEndSessionMutation,
  useGetSessionsQuery,
} from '@shared/api';
import { useToast } from '@shared/ui/Toast';

import { TEXTS } from './texts';

const NO_SESSIONS: SessionsResponse['sessions'] = [];

export const useSessions = () => {
  const { data, isLoading, error, refetch } = useGetSessionsQuery();
  const [endSession, { isLoading: isEnding, originalArgs: endingId }] = useEndSessionMutation();
  const [endOtherSessions, { isLoading: isEndingOthers }] = useEndOtherSessionsMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { notify } = useToast();

  const sessions = [...(data?.sessions ?? NO_SESSIONS)]
    .sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));

  const handleEnd = (id: string) => {
    void endSession(id).then((result) => {
      const message = getErrorMessage(result.error);
      notify(message ? 'error' : 'success', message ?? TEXTS.ended);
    });
  };

  const handleEndOthers = () => {
    setIsConfirmOpen(false);
    void endOtherSessions().then((result) => {
      const message = getErrorMessage(result.error);
      notify(message ? 'error' : 'success', message ?? TEXTS.endedOthers);
    });
  };

  return {
    sessions,
    hasOthers: sessions.some(session => !session.isCurrent),
    isLoading,
    hasLoadError: Boolean(error),
    retry: () => { void refetch(); },
    endingId: isEnding ? endingId ?? null : null,
    isEndingOthers,
    isConfirmOpen,
    openConfirm: () => { setIsConfirmOpen(true); },
    closeConfirm: () => { setIsConfirmOpen(false); },
    handleEnd,
    handleEndOthers,
  };
};
