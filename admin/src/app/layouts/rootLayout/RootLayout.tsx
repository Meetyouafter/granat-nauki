import { Outlet } from 'react-router';

import { Header } from '@widgets/header';

import styles from './RootLayout.module.scss';

const RootLayout = () => (
  <>
    <Header />
    <main className={styles.main}>
      <Outlet />
    </main>
  </>
);

export default RootLayout;
