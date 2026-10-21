import { paths } from '@shared/config';

export interface NavLinkItem {
  label: string;
  to: string;
}

export interface NavGroupItem {
  label: string;
  items: NavLinkItem[];
}

export const NAV_ITEMS: (NavLinkItem | NavGroupItem)[] = [
  { label: 'Главная', to: paths.home },
  { label: 'FAQ', to: paths.faq },
  { label: 'Отзывы', to: paths.reviews },
  {
    label: 'Управление контентом',
    items: [{ label: 'Перечень услуг', to: paths.services }],
  },
  { label: 'Запросы на доступ', to: paths.accessRequests },
  { label: 'Настройки', to: paths.settings },
];
