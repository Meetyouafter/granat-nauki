'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import classNames from 'classnames';

import { COOKIE_ACCEPTED } from '@constants';

import styles from './Cookie.module.scss';

const Cookie = () => {
  const [isCookieAccepted, setIsCookieAccepted] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    cookieStore.get(COOKIE_ACCEPTED)
      .then((res) => {
        if (!res) {
          setIsCookieAccepted(false);
        }
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }, []);

  const t = useTranslations('Cookie');

  const saveConsent = (value: 'true' | 'false') => {
    setIsHidden(true);
    cookieStore.set({
      name: COOKIE_ACCEPTED,
      value,
      path: '/',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    }).catch((error: unknown) => {
      console.error(error);
    });
  };

  const handleAccept = () => {
    saveConsent('true');
  };

  const handleReject = () => {
    saveConsent('false');
  };

  return (
    isCookieAccepted
      ? null
      : (
          <div className={classNames(styles.root, isHidden && styles.root_hidden)}>
            <h6 className={styles.title}>{t('title')}</h6>
            <p className={styles.description}>{t('description')}</p>
            <div className={styles.actions}>
              <button className={styles.button} onClick={handleAccept}>{t('accept')}</button>
              <button className={styles.rejectButton} onClick={handleReject}>{t('reject')}</button>
            </div>
          </div>
        )
  );
};

export default Cookie;
