import type { FC } from 'react';

import classNames from 'classnames';

import styles from './HamburgerMenu.module.scss';

interface IHamburgerMenu {
  label: string;
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerMenu: FC<IHamburgerMenu> = ({ label, isOpen, onClick }) => (
  <button
    type="button"
    className={classNames(styles.root, isOpen && styles.open)}
    onClick={onClick}
    aria-label={label}
    aria-expanded={isOpen}
  >
    <span className={styles.line}></span>
    <span className={styles.line}></span>
    <span className={styles.line}></span>
  </button>
);

export default HamburgerMenu;
