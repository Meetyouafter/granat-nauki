import type { ComponentPropsWithoutRef } from 'react';

import classNames from 'classnames';

import styles from './Field.module.scss';

export interface IInput extends ComponentPropsWithoutRef<'input'> {
  isInvalid?: boolean | undefined;
}

const Input = ({ isInvalid = false, className, ...props }: IInput) => (
  <input
    aria-invalid={isInvalid || undefined}
    {...props}
    className={classNames(styles.control, className)}
  />
);

export default Input;
