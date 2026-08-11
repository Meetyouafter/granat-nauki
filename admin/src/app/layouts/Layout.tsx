import { Outlet } from 'react-router'

import { Header } from '@widgets/header'

import styles from './Layout.module.scss'

function Layout() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
