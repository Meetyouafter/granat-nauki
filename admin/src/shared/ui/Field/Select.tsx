import type { ComponentPropsWithoutRef } from 'react';

import classNames from 'classnames';

import { ChevronIcon } from '../icons';

import styles from './Field.module.scss';

interface ISelect extends ComponentPropsWithoutRef<'select'> {
  isInvalid?: boolean | undefined;
}

const Select = ({ isInvalid = false, className, ...props }: ISelect) => (
  <span className={classNames(styles.selectWrap, className)}>
    <select
      aria-invalid={isInvalid || undefined}
      {...props}
      className={classNames(styles.control, styles.select)}
    />
    <ChevronIcon className={styles.selectIcon} />
  </span>
);

export default Select;
