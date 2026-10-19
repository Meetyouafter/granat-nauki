import type { ReactNode } from 'react';

import classNames from 'classnames';

import styles from './Field.module.scss';

interface IField {
  /** id of the control inside, wires up the label */
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string | undefined;
  children: ReactNode;
}

/** Label + control + error line; the error line keeps its height, so errors don't shift layout. */
const Field = ({ id, label, hint, error, className, children }: IField) => (
  <div className={classNames(styles.field, className)}>
    <label className={styles.label} htmlFor={id}>{label}</label>
    {children}
    {hint && !error && <p className={styles.hint}>{hint}</p>}
    <p className={styles.error} aria-live="polite">{error}</p>
  </div>
);

export default Field;
