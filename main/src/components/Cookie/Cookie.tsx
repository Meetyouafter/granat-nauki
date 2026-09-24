'use client';

import { useTranslations } from 'next-intl';

import styles from './Cookie.module.scss';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { COOKIE_ACCEPTED } from '@constants';

const Cookie = () => {
  const [isCookieAccepted, setIsCookieAccepted] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    cookieStore.get(COOKIE_ACCEPTED)
      .then(res => {
        if (!res) {
          setIsCookieAccepted(false);
        }
      });
  }, []);

  const t = useTranslations('Cookie');

  const handleAccept = () => {
    try {
      cookieStore.set({
        name: COOKIE_ACCEPTED,
        value: 'true',
        path: '/',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsHidden(true);
    }
  };

  const handleReject = () => {
    try {
      cookieStore.set({
        name: COOKIE_ACCEPTED,
        value: 'false',
        path: '/',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsHidden(true);
    }
  };

  return (
    isCookieAccepted ? null : (
      <div className={classNames(styles.root, {
        [styles.root_hidden]: isHidden
      })}>
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
