'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';

import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return locale === 'en'
    ? (
        <button
          onClick={() => { switchLanguage('ru'); }}
          className={styles.button}
        >
          <Image src="/icons/flags/ru.svg" alt="Russian" width={32} height={32} />
        </button>
      )
    : (
        <button
          onClick={() => { switchLanguage('en'); }}
          className={styles.button}
        >
          <Image src="/icons/flags/en.svg" alt="English" width={32} height={32} />
        </button>
      );
};

export default LanguageSwitcher;
