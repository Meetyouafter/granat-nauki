import { Link, NavLink } from 'react-router';

import classNames from 'classnames';

import { paths } from '@shared/config';
import { Button } from '@shared/ui/Button';
import { Logo } from '@shared/ui/Logo';

import { NAV_ITEMS } from '../model/navItems';
import { useAccount } from '../model/useAccount';
import NavDropdown from './NavDropdown';

import styles from './Header.module.scss';

const Header = () => {
  const { email, isSigningOut, handleSignout } = useAccount();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to={paths.home} className={styles.brand}>
          <Logo />
        </Link>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(item =>
            'items' in item
              ? (
                  <NavDropdown key={item.label} {...item} />
                )
              : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === paths.home}
                    className={({ isActive }) =>
                      classNames(styles.link, isActive && styles.linkActive)}
                  >
                    {item.label}
                  </NavLink>
                ))}
        </nav>
        <div className={styles.account}>
          {email && <span className={styles.email}>{email}</span>}
          <Button variant="ghost" size="sm" onClick={handleSignout} isLoading={isSigningOut}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
