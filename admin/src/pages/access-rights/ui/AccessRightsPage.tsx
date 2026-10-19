import classNames from 'classnames';

import { Loader } from '@shared/ui/Loader';

import { TEXTS } from '../model/texts';
import { useAccessRequest } from '../model/useAccessRequest';

import styles from './AccessRightsPage.module.scss';

const BADGE_TONES = {
  none: undefined,
  PENDING: styles.badgePending,
  REJECTED: styles.badgeRejected,
  APPROVED: styles.badgeApproved,
} as const;

const AccessRightsPage = () => {
  const {
    session,
    status,
    canRequest,
    isAccessRequestLoading,
    hasLoadError,
    isCreating,
    createErrorMessage,
    isSigningOut,
    handleRequestAccess,
    handleSignout,
    handleRetry,
  } = useAccessRequest();

  const state = status ?? 'none';
  const texts = TEXTS.states[state];

  const renderContent = () => {
    if (isAccessRequestLoading) return <Loader />;

    if (hasLoadError) {
      return (
        <>
          <h1 className={styles.title}>{TEXTS.loadError.title}</h1>
          <p className={styles.lead}>{TEXTS.loadError.lead}</p>
          <button type="button" className={styles.secondary} onClick={handleRetry}>
            {TEXTS.loadError.button}
          </button>
        </>
      );
    }

    return (
      <>
        <span className={classNames(styles.badge, BADGE_TONES[state])}>{texts.badge}</span>
        <h1 className={styles.title}>{texts.title}</h1>
        <p className={styles.lead} aria-live="polite">{texts.lead}</p>
        {canRequest && (
          <button
            type="button"
            className={styles.request}
            onClick={handleRequestAccess}
            disabled={isCreating}
          >
            {status === 'REJECTED' ? TEXTS.retryButton : TEXTS.button}
          </button>
        )}
        <p className={styles.error} aria-live="polite">{createErrorMessage}</p>
      </>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <span className={styles.brand}>{TEXTS.brand}</span>
        <div className={styles.account}>
          {session.status === 'authenticated' && (
            <span className={styles.email}>{session.user.email}</span>
          )}
          <button
            type="button"
            className={styles.signout}
            onClick={handleSignout}
            disabled={isSigningOut}
          >
            {TEXTS.signout}
          </button>
        </div>
      </header>

      <main className={styles.main}>{renderContent()}</main>
    </div>
  );
};

export default AccessRightsPage;
