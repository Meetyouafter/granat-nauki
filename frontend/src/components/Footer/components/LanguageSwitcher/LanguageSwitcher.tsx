'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import styles from './LanguageSwitcher.module.scss';
import Image from 'next/image';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('LanguageSwitcher');

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return locale === 'en' ? (
    <button
      onClick={() => switchLanguage('ru')}
      className={styles.button}
    >
      <Image src="/icons/flags/ru.svg" alt="Russian" width={32} height={32} />
      <span>{t('ru')}</span>
    </button>
  ) : (
    <button
      onClick={() => switchLanguage('en')}
      className={styles.button}
    >
      <Image src="/icons/flags/en.svg" alt="English" width={32} height={32} />
      <span>{t('en')}</span>
    </button>
  );
};

export default LanguageSwitcher;
