import type { ComponentPropsWithoutRef } from 'react';

import { getButtonClassName, type IButtonStyle } from './buttonClassName';

import styles from './Button.module.scss';

interface IButton extends Omit<ComponentPropsWithoutRef<'button'>, 'className'>, IButtonStyle {
  isLoading?: boolean;
}

const Button = ({
  variant,
  size,
  isIconOnly,
  isLoading = false,
  type = 'button',
  disabled,
  className,
  children,
  ...props
}: IButton) => (
  <button
    {...props}
    type={type}
    disabled={disabled ?? isLoading}
    aria-busy={isLoading || undefined}
    className={getButtonClassName({ variant, size, isIconOnly, className })}
  >
    {isLoading && <span className={styles.spinner} aria-hidden="true" />}
    {children}
  </button>
);

export default Button;
