import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import { paths } from '@constants';
import Button from '@ui/Button/Button';
import Text from '@ui/Text/Text';

import styles from './not-found.module.scss';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.notFound[locale] : metadata.notFound.en;
}

const NotFound = async () => {
  const t = await getTranslations('NotFoundPage');

  return (
    <main className={styles.root}>
      <Image src="/images/404.png" alt="" width={320} height={320} className={styles.image} />
      <Text as="h1" size="lg" weight="semibold" className={styles.title}>
        {t('title')}
      </Text>
      <Button href={paths.home}>{t('home')}</Button>
    </main>
  );
};

export default NotFound;
