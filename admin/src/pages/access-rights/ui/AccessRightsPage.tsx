import { Badge, type BadgeTone } from '@shared/ui/Badge';
import { Button } from '@shared/ui/Button';
import { Loader } from '@shared/ui/Loader';
import { Logo } from '@shared/ui/Logo';

import { TEXTS } from '../model/texts';
import { useAccessRequest } from '../model/useAccessRequest';

import styles from './AccessRightsPage.module.scss';

const BADGE_TONES = {
  none: 'neutral',
  PENDING: 'processing',
  REJECTED: 'error',
  APPROVED: 'success',
} as const satisfies Record<string, BadgeTone>;

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
          <Button variant="secondary" onClick={handleRetry}>
            {TEXTS.loadError.button}
          </Button>
        </>
      );
    }

    return (
      <>
        <Badge className={styles.badge} tone={BADGE_TONES[state]}>{texts.badge}</Badge>
        <h1 className={styles.title}>{texts.title}</h1>
        <p className={styles.lead} aria-live="polite">{texts.lead}</p>
        {canRequest && (
          <Button onClick={handleRequestAccess} isLoading={isCreating}>
            {status === 'REJECTED' ? TEXTS.retryButton : TEXTS.button}
          </Button>
        )}
        {createErrorMessage && <p className={styles.error} role="alert">{createErrorMessage}</p>}
      </>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <Logo />
        <div className={styles.account}>
          {session.status === 'authenticated' && (
            <span className={styles.email}>{session.user.email}</span>
          )}
          <Button variant="ghost" size="sm" onClick={handleSignout} isLoading={isSigningOut}>
            {TEXTS.signout}
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.panel}>{renderContent()}</div>
      </main>
    </div>
  );
};

export default AccessRightsPage;
