'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '@ui/Button/Button';
import Text from '@ui/Text/Text';
import { paths } from '@constants';
import styles from './error.module.scss';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage = ({ error, reset }: Props) => {
  const t = useTranslations('ErrorPage');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.root}>
      <Image src="/images/error.png" alt={t('title')} width={320} height={320} className={styles.image} />
      <Text as="p" size="lg" weight="semibold" className={styles.title}>
        {t('title')}
      </Text>
      <Text as="p" className={styles.message}>
        {t('description')}
      </Text>
      {process.env.NODE_ENV === 'development' && (
        <Text as="p" size="xs" className={styles.message}>
          {error.message}
        </Text>
      )}
      <div className={styles.actions}>
        <Button onClick={reset}>{t('retry')}</Button>
        <Button variant="secondary" href={paths.home}>{t('home')}</Button>
      </div>
    </main>
  );
};

export default ErrorPage;
