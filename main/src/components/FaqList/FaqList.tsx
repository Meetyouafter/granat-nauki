import type { FC } from 'react';

import cns from 'classnames';

import type { FaqItemDto } from '@/types';

import styles from './FaqList.module.scss';

interface IFaqList {
  items: FaqItemDto[];
  className?: string | undefined;
}

const FaqList: FC<IFaqList> = ({ items, className }) => (
  <div className={cns(styles.list, className)}>
    {items.map(item => (
      <details key={item.id} className={styles.item}>
        <summary className={styles.summary}>
          <h3 className={styles.question}>{item.title}</h3>
          <span className={styles.chevron} aria-hidden="true" />
        </summary>
        <p className={styles.answer}>{item.description}</p>
      </details>
    ))}
  </div>
);

export default FaqList;
