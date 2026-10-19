import classNames from 'classnames';

import logoSrc from './logo.png';

import styles from './Logo.module.scss';

const BRAND = 'Гранат науки';

interface ILogo {
  size?: 'sm' | 'md';
  className?: string | undefined;
}

const Logo = ({ size = 'sm', className }: ILogo) => (
  <span className={classNames(styles.logo, styles[`size-${size}`], className)}>
    <img className={styles.mark} src={logoSrc} alt="" width={64} height={64} />
    <span className={styles.wordmark}>{BRAND}</span>
  </span>
);

export default Logo;
