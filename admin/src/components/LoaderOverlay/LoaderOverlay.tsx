import styles from './LoaderOverlay.module.scss'

function LoaderOverlay() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} role="status" aria-label="Загрузка" />
    </div>
  )
}

export default LoaderOverlay
