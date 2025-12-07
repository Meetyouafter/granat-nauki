import styles from './Header.module.scss';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import MobileNavigation from './components/MobileNavigation/MobileNavigation';

const Header = () => (
  <header className={styles.root}>
    <div className={styles.container}>
      <Logo />
      <Navigation />
    </div>
    <MobileNavigation />
  </header>
);

export default Header;
