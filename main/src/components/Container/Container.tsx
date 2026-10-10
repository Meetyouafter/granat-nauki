import type { FC, ReactNode } from 'react';

import cns from 'classnames';

import styles from './Container.module.scss';

interface IContainer {
  children: ReactNode;
  className?: string | undefined;
}

const Container: FC<IContainer> = ({ children, className }) => (
  <div className={cns(styles.container, className)}>{children}</div>
);

export default Container;
