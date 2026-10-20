'use client';

import { useLocale, useTranslations } from 'next-intl';

import cns from 'classnames';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

import styles from './LanguageSwitcher.module.scss';
const LanguageSwitcher = () => {
  const t = useTranslations('Header.language');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className={styles.root} role="group" aria-label={t('label')}>
      {routing.locales.map(item => (
        <button
          key={item}
          type="button"
          lang={item}
          aria-label={t(item)}
          aria-pressed={item === locale}
          className={cns(styles.option, item === locale && styles.active)}
          onClick={() => {
            if (item !== locale) router.replace(pathname, { locale: item });
          }}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
