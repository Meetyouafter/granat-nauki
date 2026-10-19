import classNames from 'classnames';
import dayjs from 'dayjs';

import { ErrorState } from '@shared/ui/ErrorState';
import { Loader } from '@shared/ui/Loader';
import { Pagination } from '@shared/ui/Pagination';

import { TEXTS } from '../model/texts';
import { useAccessRequest } from '../model/useAccessRequest';
import AccessRequestsToolbar from './AccessRequestsToolbar';
import SortableHeader from './SortableHeader';
import StatusCell from './StatusCell';

import styles from './AccessRequestsPage.module.scss';

const AccessRequestsPage = () => {
  const {
    accessRequests,
    total,
    page,
    totalPages,
    statusFilter,
    sort,
    isAccessRequestLoading,
    isAccessRequestFetching,
    hasLoadError,
    handleSort,
    handleStatusFilter,
    handlePageChange,
    decidingId,
    handleDecide,
  } = useAccessRequest();

  if (isAccessRequestLoading) return <Loader />;
  if (hasLoadError) {
    return <ErrorState title={TEXTS.loadError.title} message={TEXTS.loadError.message} />;
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        {TEXTS.title}
        <span className={styles.count}>{total}</span>
      </h1>
      <AccessRequestsToolbar
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilter}
      />
      {accessRequests.length === 0
        ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>
                {statusFilter === 'ALL' ? TEXTS.empty : TEXTS.notFound}
              </p>
            </div>
          )
        : (
            <div
              className={classNames(styles.tableWrap, isAccessRequestFetching && styles.fetching)}
              aria-busy={isAccessRequestFetching}
            >
              <table className={styles.table}>
                <thead>
                  <tr>
                    <SortableHeader
                      label={TEXTS.columns.email}
                      sortKey="email"
                      sort={sort}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label={TEXTS.columns.createdAt}
                      sortKey="createdAt"
                      defaultDirection="desc"
                      sort={sort}
                      onSort={handleSort}
                    />
                    <th scope="col">{TEXTS.columns.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {accessRequests.map(request => (
                    <tr key={request.id}>
                      <td className={styles.email}>{request.user.email}</td>
                      <td className={styles.date}>
                        <time dateTime={request.createdAt}>
                          {dayjs(request.createdAt).format('D MMMM YYYY, HH:mm')}
                        </time>
                      </td>
                      <td>
                        <StatusCell
                          status={request.status}
                          email={request.user.email}
                          isDeciding={decidingId === request.id}
                          onDecide={(decision) => { handleDecide(request.id, decision); }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      <Pagination
        className={styles.pagination}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AccessRequestsPage;
