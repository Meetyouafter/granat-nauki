import type { ComponentPropsWithoutRef, ElementType } from 'react';
import classNames from 'classnames';
import styles from './Text.module.scss';

export type TextSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type TextWeight = 'regular' | 'semibold' | 'bold' | 'extrabold';

interface IText<T extends ElementType> {
  as?: T;
  size?: TextSize;
  weight?: TextWeight;
  italic?: boolean;
  className?: string;
}

type TextProps<T extends ElementType> = IText<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof IText<T>>;

const Text = <T extends ElementType = 'p',>({
  as,
  size = 'sm',
  weight = 'regular',
  italic = false,
  className,
  ...rest
}: TextProps<T>) => {
  const Component = as || 'p';

  const rootClassName = classNames(
    styles[`size-${size}`],
    styles[`weight-${weight}`],
    italic && styles.italic,
    className,
  );

  return <Component className={rootClassName} {...rest} />;
};

export default Text;
