import Link from 'next/link';
import styles from './Logo.module.scss';
import { paths } from '@constants';

const Logo = () => (
  <Link href={paths.home} className={styles.root}>
    <span>logo</span>
  </Link>
);

export default Logo;
