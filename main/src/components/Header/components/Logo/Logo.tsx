import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './Logo.module.scss';
import { paths } from '@constants';

const Logo = async () => {
  const t = await getTranslations('Header');

  return (
    <Link href={paths.home} className={styles.root}>
      <Image src="/images/logo.png" alt={t('logo')} width={60} height={60} className={styles.mark} />
      <span className={styles.wordmark}>{t('logo')}</span>
    </Link>
  );
};

export default Logo;
