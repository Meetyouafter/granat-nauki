'use client';

import { useRouter, usePathname } from '@/i18n';
import { useLocale } from 'next-intl';
import styles from './LanguageSwitcher.module.scss';
import Image from 'next/image';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return locale === 'en' ? (
    <button
      onClick={() => switchLanguage('ru')}
      className={styles.button}
    >
      <Image src="/icons/flags/ru.svg" alt="Russian" width={32} height={32} />
    </button>
  ) : (
    <button
      onClick={() => switchLanguage('en')}
      className={styles.button}
    >
      <Image src="/icons/flags/en.svg" alt="English" width={32} height={32} />
    </button>
  );
};

export default LanguageSwitcher;
