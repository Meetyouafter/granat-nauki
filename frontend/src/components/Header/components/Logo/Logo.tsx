import Link from 'next/link';
import PomegranateMark from '@components/PomegranateMark/PomegranateMark';
import styles from './Logo.module.scss';
import { paths } from '@constants';

const Logo = () => (
  <Link href={paths.home} className={styles.root}>
    <PomegranateMark variant="seed" className={styles.mark} />
    <span className={styles.wordmark}>Гранат науки</span>
  </Link>
);

export default Logo;
