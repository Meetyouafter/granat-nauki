import type { ReactNode } from 'react';

import { Badge, type BadgeTone } from '../Badge';
import { AlertIcon, CheckIcon, ClockIcon } from '../icons';

import styles from './StatusBadge.module.scss';

export type TranslationStatus = 'pending' | 'processing' | 'done' | 'failed';

const STATUS_MAP: Record<TranslationStatus, { icon: ReactNode; label: string; tone: BadgeTone }> = {
  pending: { icon: <ClockIcon />, label: 'В очереди', tone: 'pending' },
  processing: {
    icon: <span className={styles.spinner} aria-hidden="true" />,
    label: 'Переводится…',
    tone: 'processing',
  },
  done: { icon: <CheckIcon />, label: 'Переведено', tone: 'success' },
  failed: { icon: <AlertIcon />, label: 'Ошибка перевода', tone: 'error' },
};

interface IStatusBadge {
  status: TranslationStatus;
}

const StatusBadge = ({ status }: IStatusBadge) => {
  const { icon, label, tone } = STATUS_MAP[status];

  return (
    <Badge tone={tone} role="status" title={label}>
      {icon}
      {label}
    </Badge>
  );
};

export default StatusBadge;
