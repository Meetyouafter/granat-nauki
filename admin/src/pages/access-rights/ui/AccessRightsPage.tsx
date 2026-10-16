import { useState } from 'react';

import { useSession } from '@shared/utils/useSession';

import styles from './AccessRightsPage.module.scss';

const TEXTS = {
  title: 'Нет доступа к админке',
  description: 'Ваш аккаунт создан, но редактировать контент сайта может только администратор. '
    + 'Отправьте запрос, и после одобрения вам откроются все разделы.',
  account: 'Аккаунт',
  button: 'Запросить доступ',
  pendingTitle: 'Запрос отправлен',
  pendingDescription: 'Администратор рассмотрит его в ближайшее время. '
    + 'После одобрения войдите в админку заново.',
} as const;

// TODO: заменить на статус запроса из API (POST/GET /api/access-requests)
type RequestState = 'idle' | 'pending';

const AccessRightsPage = () => {
  const session = useSession();
  const [requestState, setRequestState] = useState<RequestState>('idle');

  const email = session.status === 'authenticated' ? session.user.email : null;
  const isPending = requestState === 'pending';

  const handleRequest = () => {
    setRequestState('pending');
  };

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <span className={styles.icon} aria-hidden="true">{isPending ? '✓' : '🔒'}</span>
        <h1 className={styles.title}>{isPending ? TEXTS.pendingTitle : TEXTS.title}</h1>
        <p className={styles.description}>
          {isPending ? TEXTS.pendingDescription : TEXTS.description}
        </p>
        {email && (
          <dl className={styles.account}>
            <dt className={styles.accountLabel}>{TEXTS.account}</dt>
            <dd className={styles.accountValue}>{email}</dd>
          </dl>
        )}
        {!isPending && (
          <button type="button" className={styles.submit} onClick={handleRequest}>
            {TEXTS.button}
          </button>
        )}
      </section>
    </main>
  );
};

export default AccessRightsPage;
