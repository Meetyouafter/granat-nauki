import { ChevronIcon } from '../icons';
import { getPageItems } from './getPageItems';

import styles from './Pagination.module.scss';

interface IPagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string | undefined;
}

const Pagination = ({ page, totalPages, onPageChange, className }: IPagination) => {
  if (totalPages <= 1) return null;

  return (
    <nav className={className} aria-label="Страницы">
      <ul className={styles.list}>
        <li>
          <button
            type="button"
            className={styles.item}
            onClick={() => { onPageChange(page - 1); }}
            disabled={page <= 1}
            aria-label="Предыдущая страница"
          >
            <ChevronIcon />
          </button>
        </li>
        {getPageItems(page, totalPages).map((item, index) => (
          item === 'gap'
            ? (
                <li key={`gap-${String(index)}`} className={styles.gap} aria-hidden="true">…</li>
              )
            : (
                <li key={item}>
                  <button
                    type="button"
                    className={styles.item}
                    onClick={() => { onPageChange(item); }}
                    aria-current={item === page ? 'page' : undefined}
                    aria-label={`Страница ${String(item)}`}
                  >
                    {item}
                  </button>
                </li>
              )
        ))}
        <li>
          <button
            type="button"
            className={styles.item}
            onClick={() => { onPageChange(page + 1); }}
            disabled={page >= totalPages}
            aria-label="Следующая страница"
          >
            <ChevronIcon className={styles.next} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
