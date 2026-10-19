import classNames from 'classnames';

import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface IButtonStyle {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  isIconOnly?: boolean | undefined;
  className?: string | undefined;
}

/** Button look for elements that aren't a <button>, e.g. a router Link. */
export const getButtonClassName = ({
  variant = 'primary',
  size = 'md',
  isIconOnly = false,
  className,
}: IButtonStyle = {}) => classNames(
  styles.button,
  styles[`variant-${variant}`],
  styles[`size-${size}`],
  isIconOnly && styles.iconOnly,
  className,
);
