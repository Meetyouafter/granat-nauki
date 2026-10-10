import type { FC, ReactNode } from 'react';
import styles from './Container.module.scss';
import cns from 'classnames';

interface IContainer {
  children: ReactNode;
  className?: string | undefined;
}

const Container: FC<IContainer> = ({ children, className }) => (
  <div className={cns(styles.container, className)}>{children}</div>
);

export default Container;


