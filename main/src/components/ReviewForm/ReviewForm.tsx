'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styles from './ReviewForm.module.scss';

const ReviewForm = () => {
  const t = useTranslations('ReviewForm');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleButton}
      >
        {isOpen ? t('toggleClose') : t('toggleOpen')}
      </button>

      {isOpen && (
        <form action="#" method="post" className={styles.form}>
          <label>
            {t('name')}
            <input name="name" placeholder={t('namePlaceholder')} className={styles.input} />
          </label>
          <label>
            {t('text')}
            <textarea name="text" placeholder={t('textPlaceholder')} rows={6} className={styles.textarea} />
          </label>
          <button type="submit" className={styles.submit}>{t('submit')}</button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;





