import type { FC, ReactNode } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import styles from './TextLink.module.scss';

interface ITextLink {
  href: string;
  className?: string;
  children?: ReactNode;
}

const TextLink: FC<ITextLink> = ({ href, className, children }) => (
  <Link href={href} className={classNames(styles.link, className)}>
    {children}
  </Link>
);

export default TextLink;
