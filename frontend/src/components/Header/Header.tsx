import styles from './Header.module.scss';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import MobileNavigation from './components/MobileNavigation/MobileNavigation';
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';

const Header = () => (
  <header className={styles.root}>
    <div className={styles.container}>
      <Logo />
      <div className={styles.right}>
        <Navigation />
        <div className={styles.settings}>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </div>
    <MobileNavigation />
  </header>
);

export default Header;
