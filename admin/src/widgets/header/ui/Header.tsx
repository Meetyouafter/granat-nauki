import { NavLink } from 'react-router'

import classNames from 'classnames'

import { paths } from '@shared/config'

import { NAV_ITEMS } from '../model/navItems'

import styles from './Header.module.scss'

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === paths.home}
            className={({ isActive }) => classNames(styles.link, isActive && styles.linkActive)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Header
