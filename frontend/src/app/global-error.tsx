'use client';

import { useEffect } from 'react';
import '@styles/index.scss';
import styles from './global-error.module.scss';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: Props) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ru">
      <body>
        <main className={styles.root}>
          <p className={styles.title}>Что-то сломалось</p>
          <p className={styles.message}>
            Произошла непредвиденная ошибка. Попробуйте обновить страницу или вернуться на главную.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className={styles.digest}>{error.message}</p>
          )}
          <div className={styles.actions}>
            <button type="button" onClick={reset}>Попробовать снова</button>
            <a href="/">На главную</a>
          </div>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
