import { ActiveSessions } from '@widgets/active-sessions';

import { ChangePasswordForm } from '@features/change-password';

import { PageHeader } from '@shared/ui/PageHeader';

import styles from './SettingsPage.module.scss';

const SettingsPage = () => (
  <div className={styles.wrapper}>
    <PageHeader title="Настройки" />
    <ChangePasswordForm />
    <ActiveSessions />
  </div>
);

export default SettingsPage;
