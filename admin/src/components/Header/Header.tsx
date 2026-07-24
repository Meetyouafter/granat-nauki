import { NavLink } from 'react-router'
import { NAV_ITEMS, paths } from '@constants'
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
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Header
