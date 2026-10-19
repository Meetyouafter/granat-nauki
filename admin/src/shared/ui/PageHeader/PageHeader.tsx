import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { Badge } from '../Badge';
import { ChevronIcon } from '../icons';

import styles from './PageHeader.module.scss';

interface IPageHeader {
  title: ReactNode;
  count?: number | undefined;
  /** Rendered next to the title, e.g. a status badge */
  extra?: ReactNode;
  actions?: ReactNode;
  back?: { to: string; label: string } | undefined;
}

const PageHeader = ({ title, count, extra, actions, back }: IPageHeader) => (
  <header className={styles.header}>
    <div className={styles.heading}>
      {back && (
        <Link className={styles.back} to={back.to}>
          <ChevronIcon />
          {back.label}
        </Link>
      )}
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        {count !== undefined && <Badge className={styles.count}>{count}</Badge>}
        {extra}
      </div>
    </div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </header>
);

export default PageHeader;
