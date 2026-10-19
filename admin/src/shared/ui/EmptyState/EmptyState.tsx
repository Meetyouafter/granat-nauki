import type { ReactNode } from 'react';

import styles from './EmptyState.module.scss';

interface IEmptyState {
  text: ReactNode;
  action?: ReactNode;
}

const EmptyState = ({ text, action }: IEmptyState) => (
  <div className={styles.empty}>
    <p className={styles.text}>{text}</p>
    {action}
  </div>
);

export default EmptyState;
