import { useState } from 'react'
import { useNavigate } from 'react-router'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import styles from './FormActions.module.scss'

interface IFormActions {
  onSave: () => void
  saveLabel?: string
  cancelLabel?: string
  disabled?: boolean
}

function FormActions({
  onSave,
  saveLabel = 'Сохранить',
  cancelLabel = 'Отменить',
  disabled = false,
}: IFormActions) {
  const navigate = useNavigate()
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancelConfirm = () => {
    setIsCancelling(false)
    navigate('/')
  }

  return (
    <>
      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={() => setIsCancelling(true)}>
          {cancelLabel}
        </button>
        <button type="button" className={styles.save} onClick={onSave} disabled={disabled}>
          {saveLabel}
        </button>
      </div>
      {isCancelling && (
        <ConfirmModal
          title="Отменить изменения?"
          message="Вы уверены? Несохранённые изменения будут потеряны."
          confirmLabel="Да, отменить"
          cancelLabel="Продолжить редактирование"
          onConfirm={handleCancelConfirm}
          onCancel={() => setIsCancelling(false)}
        />
      )}
    </>
  )
}

export default FormActions
