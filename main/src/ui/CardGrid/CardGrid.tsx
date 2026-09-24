import type { CSSProperties, FC, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './CardGrid.module.scss';

interface ICardGrid {
  minWidth?: number;
  ordered?: boolean;
  className?: string;
  children?: ReactNode;
}

const CardGrid: FC<ICardGrid> = ({ minWidth = 280, ordered = false, className, children }) => {
  const Component = ordered ? 'ol' : 'ul';

  const gridStyle = { '--card-grid-min-width': `${minWidth}px` } as CSSProperties;

  return (
    <Component className={classNames(styles.grid, className)} style={gridStyle}>
      {children}
    </Component>
  );
};

export default CardGrid;
