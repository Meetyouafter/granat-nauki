import { FC } from 'react';
import styles from './HamburgerMenu.module.scss';

interface IHamburgerMenu {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerMenu: FC<IHamburgerMenu> = ({ isOpen, onClick }) => {
  return (
    <button
      className={`${styles.root} ${isOpen ? styles.open : ''}`}
      onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <span className={styles.line}></span>
      <span className={styles.line}></span>
      <span className={styles.line}></span>
    </button>
  );
};

export default HamburgerMenu;

