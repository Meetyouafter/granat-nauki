import { getTranslations } from 'next-intl/server';
import Section from '../../../components/Section/Section';
import styles from './page.module.scss';
import metadata from '@/data/metadata';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return metadata.articles[locale as keyof typeof metadata.articles] ?? metadata.articles.en;
}

const ArticlesPage = async () => {
  const t = await getTranslations('ArticlesPage');

  return (
    <main className={styles.main}>
      <Section title={t('title')} lead={t('lead')}>
        <p className={styles.placeholder}>{t('comingSoon')}</p>
      </Section>
    </main>
  );
};

export default ArticlesPage;
