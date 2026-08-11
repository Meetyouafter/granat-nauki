import classNames from 'classnames'

import styles from './StatusBadge.module.scss'

export type TranslationStatus = 'pending' | 'processing' | 'done' | 'failed'

const STATUS_MAP: Record<TranslationStatus, { icon: string; label: string; tone: string }> = {
  pending: { icon: '⏳', label: 'В очереди', tone: 'pending' },
  processing: { icon: '', label: 'Переводится…', tone: 'processing' },
  done: { icon: '✓', label: 'Переведено', tone: 'success' },
  failed: { icon: '⚠', label: 'Ошибка перевода', tone: 'error' },
}

interface IStatusBadge {
  status: TranslationStatus
}

function StatusBadge({ status }: IStatusBadge) {
  const { icon, label, tone } = STATUS_MAP[status]

  return (
    <span className={classNames(styles.badge, styles[tone])} role="status" title={label}>
      {status === 'processing' ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <span aria-hidden="true">{icon}</span>
      )}
      {label}
    </span>
  )
}

export default StatusBadge
