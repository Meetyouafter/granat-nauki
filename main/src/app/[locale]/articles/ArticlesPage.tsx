import styles from './ArticlesPage.module.scss';
import type { FC } from 'react';
import type { ArticleDto } from '@/types';

interface IArticlesPage {
  articles: ArticleDto[];
}

const ArticlesPage: FC<IArticlesPage> = ({ articles }) => {
  return (
    <main className={styles.main}>
      {articles.map((article) => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.content}</p>
        </div>
      ))}
    </main>
  );
};

export default ArticlesPage;
