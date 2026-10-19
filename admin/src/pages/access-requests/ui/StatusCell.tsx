import type { AccessRequestDecision, AccessRequestStatus } from '@granat/contracts';

import { Badge } from '@shared/ui/Badge';
import { Button } from '@shared/ui/Button';
import { CheckIcon, CrossIcon } from '@shared/ui/icons';

import { TEXTS } from '../model/texts';

import styles from './StatusCell.module.scss';

const BADGE_TONES = {
  PENDING: 'processing',
  REJECTED: 'error',
  APPROVED: 'success',
} as const;

interface IStatusCell {
  status: AccessRequestStatus;
  email: string;
  isDeciding?: boolean;
  onDecide: (decision: AccessRequestDecision) => void;
}

const StatusCell = ({ status, email, isDeciding = false, onDecide }: IStatusCell) => {
  if (status !== 'PENDING') {
    return (
      <Badge tone={BADGE_TONES[status]}>
        {TEXTS.statuses[status]}
      </Badge>
    );
  }

  return (
    <div
      className={styles.actions}
      role="group"
      aria-label={`${TEXTS.decision.groupLabel}: ${email}`}
      aria-busy={isDeciding}
    >
      <Button size="sm" onClick={() => { onDecide('APPROVED'); }} disabled={isDeciding}>
        <CheckIcon />
        {TEXTS.decision.APPROVED}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className={styles.reject}
        onClick={() => { onDecide('REJECTED'); }}
        disabled={isDeciding}
      >
        <CrossIcon />
        {TEXTS.decision.REJECTED}
      </Button>
    </div>
  );
};

export default StatusCell;
