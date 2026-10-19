import type { AccessRequestDecision, AccessRequestStatus } from '@granat/contracts';
import classNames from 'classnames';

import { CheckIcon, CrossIcon } from '@shared/ui/icons';

import { TEXTS } from '../model/texts';

import styles from './StatusCell.module.scss';

const BADGE_TONES = {
  PENDING: styles.badgePending,
  REJECTED: styles.badgeRejected,
  APPROVED: styles.badgeApproved,
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
      <span className={classNames(styles.badge, BADGE_TONES[status])}>
        {TEXTS.statuses[status]}
      </span>
    );
  }

  return (
    <div
      className={styles.actions}
      role="group"
      aria-label={`${TEXTS.decision.groupLabel}: ${email}`}
      aria-busy={isDeciding}
    >
      <button
        type="button"
        className={classNames(styles.action, styles.approve)}
        onClick={() => { onDecide('APPROVED'); }}
        disabled={isDeciding}
      >
        <CheckIcon />
        {TEXTS.decision.APPROVED}
      </button>
      <button
        type="button"
        className={classNames(styles.action, styles.reject)}
        onClick={() => { onDecide('REJECTED'); }}
        disabled={isDeciding}
      >
        <CrossIcon />
        {TEXTS.decision.REJECTED}
      </button>
    </div>
  );
};

export default StatusCell;
