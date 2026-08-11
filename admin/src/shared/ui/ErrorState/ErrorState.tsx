import { Link } from 'react-router'

import { paths } from '@shared/config'

import styles from './ErrorState.module.scss'

interface IErrorState {
  message?: string
}

function ErrorState({ message }: IErrorState) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Возникла ошибка</h1>
      {message && <p className={styles.message}>{message}</p>}
      <Link to={paths.home} className={styles.button}>
        Вернуться на главную
      </Link>
    </div>
  )
}

export default ErrorState
