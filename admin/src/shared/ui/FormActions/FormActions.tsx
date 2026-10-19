import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '../Button';
import { ConfirmModal } from '../ConfirmModal';

import styles from './FormActions.module.scss';

interface IFormActions {
  onSave: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  isSaving?: boolean;
}

const FormActions = ({
  onSave,
  saveLabel = 'Сохранить',
  cancelLabel = 'Отменить',
  disabled = false,
  isSaving = false,
}: IFormActions) => {
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelConfirm = () => {
    setIsCancelling(false);
    void navigate('/');
  };

  return (
    <>
      <div className={styles.actions}>
        <Button variant="ghost" onClick={() => { setIsCancelling(true); }}>
          {cancelLabel}
        </Button>
        <Button onClick={onSave} disabled={disabled} isLoading={isSaving}>
          {saveLabel}
        </Button>
      </div>
      {isCancelling && (
        <ConfirmModal
          title="Отменить изменения?"
          message="Вы уверены? Несохранённые изменения будут потеряны."
          confirmLabel="Да, отменить"
          cancelLabel="Продолжить редактирование"
          onConfirm={handleCancelConfirm}
          onCancel={() => { setIsCancelling(false); }}
        />
      )}
    </>
  );
};

export default FormActions;
