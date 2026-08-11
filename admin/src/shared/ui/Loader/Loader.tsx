import styles from './Loader.module.scss'

function Loader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} role="status" aria-label="Загрузка" />
    </div>
  )
}

export default Loader
