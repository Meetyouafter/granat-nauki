import Container from '../Container/Container';
import styles from './Header.module.scss';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import MobileNavigation from './components/MobileNavigation/MobileNavigation';

const Header = () => (
  <header className={styles.root}>
    <Container className={styles.container}>
      <MobileNavigation />
      <Logo />
      <Navigation />
    </Container>
  </header>
);

export default Header;
