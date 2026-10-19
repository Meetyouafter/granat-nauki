import { Button } from '../Button';

import styles from './ConfirmModal.module.scss';

interface IConfirmModal {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  title,
  message,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
}: IConfirmModal) => (
  <div className={styles.overlay} onClick={onCancel}>
    <div
      className={styles.dialog}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={(event) => { event.stopPropagation(); }}
    >
      <h2 className={styles.title} id="confirm-modal-title">{title}</h2>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
