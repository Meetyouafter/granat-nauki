import { TEXTS } from '../model/texts';
import { STATUS_FILTERS, type StatusFilter } from '../model/types';

import styles from './AccessRequestsToolbar.module.scss';

interface IAccessRequestsToolbar {
  statusFilter: StatusFilter;
  counts?: Partial<Record<StatusFilter, number>>;
  onStatusFilterChange: (status: StatusFilter) => void;
}

const AccessRequestsToolbar = ({
  statusFilter,
  counts = {},
  onStatusFilterChange,
}: IAccessRequestsToolbar) => (
  <div className={styles.toolbar}>
    <div className={styles.segmented} role="group" aria-label={TEXTS.filters.label}>
      {STATUS_FILTERS.map(status => (
        <button
          key={status}
          type="button"
          className={styles.segment}
          aria-pressed={status === statusFilter}
          onClick={() => { onStatusFilterChange(status); }}
        >
          {TEXTS.filters[status]}
          {counts[status] !== undefined && (
            <span className={styles.segmentCount}>{counts[status]}</span>
          )}
        </button>
      ))}
    </div>
  </div>
);

export default AccessRequestsToolbar;
