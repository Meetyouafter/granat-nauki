import { getTranslations } from 'next-intl/server';
import { paths } from '@constants';
import Text from '@ui/Text/Text';
import TextLink from '@ui/TextLink/TextLink';
import Socials from './components/Socials/Socials';
import styles from './Footer.module.scss';

export default async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();

  const links = [
    { href: paths.contacts, label: t('links.contacts') },
    { href: paths.privacy, label: t('links.privacy') },
    { href: paths.terms, label: t('links.terms') },
  ];

  return (
    <footer className={styles.root}>
      <div className={styles.container}>
        <div className={styles.row}>
          <nav className={styles.links}>
            {links.map(({ href, label }) => (
              <TextLink key={href} href={href}>
                {label}
              </TextLink>
            ))}
          </nav>
          <Socials title={t('socials.title')} />
        </div>
        <Text size="sm" className={styles.copyright}>
          {t('copyright', { year })}
        </Text>
      </div>
    </footer>
  );
}


