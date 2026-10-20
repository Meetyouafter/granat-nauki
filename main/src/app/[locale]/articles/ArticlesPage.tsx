import type { FC } from 'react';
import { getTranslations } from 'next-intl/server';

import type { ArticleDto } from '@/types';
import Section from '@components/Section/Section';
import Text from '@ui/Text/Text';

import styles from './ArticlesPage.module.scss';

interface IArticlesPage {
  articles: ArticleDto[];
}

const ArticlesPage: FC<IArticlesPage> = async ({ articles }) => {
  const t = await getTranslations('ArticlesPage');

  return (
    <main>
      <Section title={t('title')} lead={t('lead')} pageTitle>
        {articles.length === 0
          ? <Text className={styles.empty}>{t('empty')}</Text>
          : (
              <div className={styles.list}>
                {articles.map(article => (
                  <article key={article.id} id={`article-${article.id}`} className={styles.article}>
                    <Text as="h2" size="lg" weight="semibold" italic className={styles.title}>
                      {article.title}
                    </Text>
                    <Text as="p" className={styles.content}>
                      {article.content}
                    </Text>
                  </article>
                ))}
              </div>
            )}
      </Section>
    </main>
  );
};

export default ArticlesPage;
