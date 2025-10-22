'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import styles from './LanguageSwitcher.module.scss';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // Обновляем URL с новым языком
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => switchLanguage('ru')}
        className={`${styles.button} ${locale === 'ru' ? styles.buttonActive : styles.buttonInactive}`}
      >
        RU
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`${styles.button} ${locale === 'en' ? styles.buttonActive : styles.buttonInactive}`}
      >
        EN
      </button>
    </div>
  );
}

