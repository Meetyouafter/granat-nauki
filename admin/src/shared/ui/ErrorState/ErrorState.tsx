import { Link } from 'react-router';

import { paths } from '@shared/config';

import styles from './ErrorState.module.scss';

interface IErrorState {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ title = 'Возникла ошибка', message, onRetry }: IErrorState) => (
  <div className={styles.wrapper} role="alert">
    <h1 className={styles.title}>{title}</h1>
    {message && <p className={styles.message}>{message}</p>}
    {onRetry
      ? (
          <button type="button" className={styles.button} onClick={onRetry}>
            Попробовать снова
          </button>
        )
      : (
          <Link to={paths.home} className={styles.button}>
            Вернуться на главную
          </Link>
        )}
  </div>
);

export default ErrorState;
