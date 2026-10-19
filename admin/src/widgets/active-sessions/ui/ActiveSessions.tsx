import dayjs from 'dayjs';

import { Badge } from '@shared/ui/Badge';
import { Button } from '@shared/ui/Button';
import { ConfirmModal } from '@shared/ui/ConfirmModal';
import { ErrorState } from '@shared/ui/ErrorState';
import { Loader } from '@shared/ui/Loader';

import { describeUserAgent } from '../lib/describeUserAgent';
import { TEXTS } from '../model/texts';
import { useSessions } from '../model/useSessions';

import styles from './ActiveSessions.module.scss';

const DATE_FORMAT = 'D MMMM YYYY, HH:mm';

const ActiveSessions = () => {
  const {
    sessions,
    hasOthers,
    isLoading,
    hasLoadError,
    retry,
    endingId,
    isEndingOthers,
    isConfirmOpen,
    openConfirm,
    closeConfirm,
    handleEnd,
    handleEndOthers,
  } = useSessions();

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (hasLoadError) {
      return (
        <ErrorState
          title={TEXTS.loadError.title}
          message={TEXTS.loadError.message}
          onRetry={retry}
        />
      );
    }

    return (
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{TEXTS.columns.device}</th>
              <th scope="col">{TEXTS.columns.ip}</th>
              <th scope="col">{TEXTS.columns.createdAt}</th>
              <th scope="col">{TEXTS.columns.lastActiveAt}</th>
              <th scope="col"><span className={styles.visuallyHidden}>{TEXTS.end}</span></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session.id}>
                <td>
                  <span className={styles.device} title={session.userAgent ?? undefined}>
                    {describeUserAgent(session.userAgent) ?? TEXTS.unknownDevice}
                  </span>
                </td>
                <td className={styles.meta}>{session.ip ?? TEXTS.unknownIp}</td>
                <td className={styles.meta}>
                  <time dateTime={session.createdAt}>
                    {dayjs(session.createdAt).format(DATE_FORMAT)}
                  </time>
                </td>
                <td className={styles.meta}>
                  <time dateTime={session.lastActiveAt}>
                    {dayjs(session.lastActiveAt).format(DATE_FORMAT)}
                  </time>
                </td>
                <td className={styles.action}>
                  {session.isCurrent
                    ? <Badge tone="accent">{TEXTS.current}</Badge>
                    : (
                        <Button
                          variant="ghost"
                          size="sm"
                          isLoading={endingId === session.id}
                          onClick={() => { handleEnd(session.id); }}
                        >
                          {TEXTS.end}
                        </Button>
                      )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className={styles.block} aria-labelledby="active-sessions-title">
      <header className={styles.header}>
        <div className={styles.heading}>
          <div className={styles.titleRow}>
            <h2 className={styles.title} id="active-sessions-title">{TEXTS.title}</h2>
            {sessions.length > 0 && <Badge>{sessions.length}</Badge>}
          </div>
          <p className={styles.description}>{TEXTS.description}</p>
        </div>
        {hasOthers && (
          <Button variant="danger" size="sm" onClick={openConfirm} isLoading={isEndingOthers}>
            {TEXTS.endOthers}
          </Button>
        )}
      </header>
      {renderContent()}
      {isConfirmOpen && (
        <ConfirmModal
          title={TEXTS.confirmEndOthers.title}
          message={TEXTS.confirmEndOthers.message}
          confirmLabel={TEXTS.confirmEndOthers.confirm}
          onConfirm={handleEndOthers}
          onCancel={closeConfirm}
        />
      )}
    </section>
  );
};

export default ActiveSessions;
