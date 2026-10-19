import type { ComponentPropsWithoutRef } from 'react';

import classNames from 'classnames';

import styles from './Field.module.scss';

interface ITextarea extends ComponentPropsWithoutRef<'textarea'> {
  isInvalid?: boolean | undefined;
}

const Textarea = ({ isInvalid = false, className, ...props }: ITextarea) => (
  <textarea
    aria-invalid={isInvalid || undefined}
    {...props}
    className={classNames(styles.control, styles.textarea, className)}
  />
);

export default Textarea;
