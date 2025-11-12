import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { contacts } from '@/constants';

import styles from './page.module.scss';

export default async function ContactsPage() {
  const t = await getTranslations('ContactsPage');

  return (
    <main className={styles.root}>
      <div className={styles.picture}>
        <Image
          src="/images/image.jpg"
          alt={t('title')}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h2 className={styles.title}>{t('title')}</h2>
      <form action="#" method="post" className={styles.request}>
        <label>
          {t('request.name')}
          <input name="name" placeholder={t('request.namePlaceholder')} className={styles.input} />
        </label>
        <label>
          {t('request.contact')}
          <input name="contact" placeholder={t('request.contactPlaceholder')} className={styles.input} />
        </label>
        <label>
          {t('request.message')}
          <textarea name="message" rows={5} placeholder="Чем могу помочь?" className={styles.textarea} />
        </label>
        <button type="submit" className={styles.submit}>{t('request.submit')}</button>
      </form>
      <div className={styles.contacts}>
        <a href={contacts.telegram} target="_blank" rel="noreferrer">{t('contacts.telegram')}</a>
        <a href={contacts.email} target="_blank" rel="noreferrer">{t('contacts.email')}</a>
        <a href={contacts.whatsapp} target="_blank" rel="noreferrer">{t('contacts.whatsapp')}</a>
      </div>
    </main>
  );
}


