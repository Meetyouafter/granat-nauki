export const TEXTS = {
  title: 'Запросы на доступ',
  columns: {
    email: 'Почта',
    createdAt: 'Дата запроса',
    status: 'Статус',
  },
  statuses: {
    PENDING: 'На рассмотрении',
    APPROVED: 'Одобрен',
    REJECTED: 'Отклонён',
  },
  decision: {
    groupLabel: 'Решение по запросу',
    APPROVED: 'Одобрить',
    REJECTED: 'Отклонить',
  },
  filters: {
    label: 'Фильтр по статусу',
    ALL: 'Все',
    PENDING: 'На рассмотрении',
    APPROVED: 'Одобренные',
    REJECTED: 'Отклонённые',
  },
  search: {
    label: 'Поиск по почте',
    placeholder: 'Поиск по почте',
  },
  empty: 'Запросов на доступ пока нет',
  notFound: 'Нет запросов, подходящих под фильтр',
  loadError: {
    title: 'Не удалось загрузить запросы',
    message: 'Проверьте соединение и попробуйте ещё раз.',
  },
} as const;
