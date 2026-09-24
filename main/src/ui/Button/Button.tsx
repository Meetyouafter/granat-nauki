import type { FC, ReactNode } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary';

interface IButton {
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

const Button: FC<IButton> = ({ variant = 'primary', href, className, children, onClick }) => {
  const rootClassName = classNames(styles.button, styles[`variant-${variant}`], className);

  if (href) {
    return (
      <Link href={href} className={rootClassName} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={rootClassName} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
