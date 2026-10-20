import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import metadata from '@/data/metadata';
import { routing } from '@/i18n/routing';
import Section from '@components/Section/Section';
import { contacts } from '@constants';
import Text from '@ui/Text/Text';

import styles from './page.module.scss';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? metadata.contacts[locale] : metadata.contacts.en;
}

const ContactsPage = async () => {
  const t = await getTranslations('ContactsPage');

  const contactLinks = [
    {
      href: contacts.telegram,
      label: t('contacts.telegram'),
      value: contacts.telegramHandle,
      external: true,
    },
    {
      href: `mailto:${contacts.email}`,
      label: t('contacts.email'),
      value: contacts.email,
      external: false,
    },
    {
      href: contacts.whatsapp,
      label: t('contacts.whatsapp'),
      value: contacts.phone,
      external: true,
    },
  ];

  return (
    <main>
      <Section>
        <div className={styles.header}>
          <div className={styles.picture}>
            <Image
              src="/images/image.jpg"
              alt={t('imageAlt')}
              fill
              priority
              sizes="(max-width: 768px) 300px, 400px"
              className={styles.image}
            />
          </div>
          <div className={styles.headerContent}>
            <Text as="h1" size="xl" weight="semibold" italic className={styles.title}>
              {t('title')}
            </Text>
            <Text as="p" size="md" className={styles.subtitle}>
              {t('subtitle')}
            </Text>
          </div>
        </div>
      </Section>

      <Section>
        <div className={styles.content}>
          <div className={styles.column}>
            <Text as="h2" size="lg" weight="semibold" italic className={styles.sectionTitle}>
              {t('request.title')}
            </Text>
            <form action="#" method="post" className={styles.form}>
              <label className={styles.field}>
                <span className={styles.label}>{t('request.name')}</span>
                <input
                  name="name"
                  autoComplete="name"
                  placeholder={t('request.namePlaceholder')}
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('request.contact')}</span>
                <input
                  name="contact"
                  type="text"
                  placeholder={t('request.contactPlaceholder')}
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('request.message')}</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder={t('request.messagePlaceholder')}
                  className={styles.input}
                  required
                />
              </label>
              <button type="submit" className={styles.submit}>
                {t('request.submit')}
              </button>
            </form>
          </div>

          <div className={styles.column}>
            <Text as="h2" size="lg" weight="semibold" italic className={styles.sectionTitle}>
              {t('contacts.title')}
            </Text>
            <ul className={styles.contacts}>
              {contactLinks.map(({ href, label, value, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    className={styles.contact}
                    {...(external && { target: '_blank', rel: 'noreferrer' })}
                  >
                    <Text as="span" size="xs" className={styles.contactLabel}>{label}</Text>
                    <Text as="span" size="md" weight="semibold" className={styles.contactValue}>
                      {value}
                    </Text>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </main>
  );
};

export default ContactsPage;
