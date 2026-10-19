import { Link } from 'react-router';

import { paths } from '@shared/config';

import { Button, getButtonClassName } from '../Button';
import { AlertIcon } from '../icons';

import styles from './ErrorState.module.scss';

interface IErrorState {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ title = 'Возникла ошибка', message, onRetry }: IErrorState) => (
  <div className={styles.wrapper} role="alert">
    <span className={styles.icon}>
      <AlertIcon width={24} height={24} />
    </span>
    <h1 className={styles.title}>{title}</h1>
    {message && <p className={styles.message}>{message}</p>}
    {onRetry
      ? (
          <Button className={styles.button} onClick={onRetry}>
            Попробовать снова
          </Button>
        )
      : (
          <Link to={paths.home} className={getButtonClassName({ className: styles.button })}>
            Вернуться на главную
          </Link>
        )}
  </div>
);

export default ErrorState;
