import styles from './LoaderOverlay.module.scss';

const LoaderOverlay = () => (
  <div className={styles.overlay}>
    <div className={styles.spinner} role="status" aria-label="Загрузка" />
  </div>
);

export default LoaderOverlay;
