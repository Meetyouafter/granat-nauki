import type { FC, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './Card.module.scss';

interface ICard {
  className?: string;
  children?: ReactNode;
}

const Card: FC<ICard> = ({ className, children }) => (
  <li className={classNames(styles.card, className)}>{children}</li>
);

export default Card;
