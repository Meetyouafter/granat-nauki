import { ActiveSessions } from '@widgets/active-sessions';

import styles from './HomePage.module.scss';

const HomePage = () => (
  <div className={styles.wrapper}>
    <ActiveSessions />
  </div>
);

export default HomePage;
