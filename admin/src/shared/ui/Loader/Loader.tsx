import styles from './Loader.module.scss';

const Loader = () => (
  <div className={styles.wrapper}>
    <div className={styles.spinner} role="status" aria-label="Загрузка" />
  </div>
);

export default Loader;
