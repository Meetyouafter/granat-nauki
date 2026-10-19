import classNames from 'classnames';

import { ArrowUpIcon, SortIcon } from '@shared/ui/icons';

import type { SortDirection, SortKey, SortState } from '../model/types';

import styles from './SortableHeader.module.scss';

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;

interface ISortableHeader {
  label: string;
  sortKey: SortKey;
  defaultDirection?: SortDirection;
  sort: SortState;
  onSort: (key: SortKey, direction: SortDirection) => void;
}

const SortableHeader = ({
  label,
  sortKey,
  defaultDirection = 'asc',
  sort,
  onSort,
}: ISortableHeader) => {
  const isActive = sort.key === sortKey;
  const nextDirection = isActive
    ? (sort.direction === 'asc' ? 'desc' : 'asc')
    : defaultDirection;

  return (
    <th scope="col" aria-sort={isActive ? ARIA_SORT[sort.direction] : 'none'}>
      <button
        type="button"
        className={classNames(styles.button, isActive && styles.active)}
        onClick={() => { onSort(sortKey, nextDirection); }}
      >
        {label}
        {isActive
          ? (
              <ArrowUpIcon
                className={classNames(styles.icon, sort.direction === 'desc' && styles.desc)}
              />
            )
          : <SortIcon className={styles.icon} />}
      </button>
    </th>
  );
};

export default SortableHeader;
