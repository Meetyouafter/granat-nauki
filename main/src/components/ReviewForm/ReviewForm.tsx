'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import Button from '@ui/Button/Button';

import styles from './ReviewForm.module.scss';

const ReviewForm = () => {
  const t = useTranslations('ReviewForm');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Button variant="secondary" onClick={() => { setIsOpen(!isOpen); }}>
        {isOpen ? t('toggleClose') : t('toggleOpen')}
      </Button>

      {isOpen && (
        <form action="#" method="post" className={styles.form}>
          <label className={styles.field}>
            <span className={styles.label}>{t('name')}</span>
            <input name="name" placeholder={t('namePlaceholder')} className={styles.input} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{t('text')}</span>
            <textarea
              name="text"
              placeholder={t('textPlaceholder')}
              rows={6}
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.submit}>{t('submit')}</button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
