import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';
import Logo from './components/Logo/Logo';
import MobileNavigation from './components/MobileNavigation/MobileNavigation';
import Navigation from './components/Navigation/Navigation';
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher';

import styles from './Header.module.scss';

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
