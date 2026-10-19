export type PageItem = number | 'gap';

const MAX_ITEMS = 7;

export const getPageItems = (page: number, totalPages: number): PageItem[] => {
  if (totalPages <= MAX_ITEMS) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(2, Math.min(page - 1, totalPages - 4));
  const end = Math.min(totalPages - 1, Math.max(page + 1, 5));

  const items: PageItem[] = [1];
  if (start > 2) items.push('gap');
  for (let current = start; current <= end; current += 1) items.push(current);
  if (end < totalPages - 1) items.push('gap');
  items.push(totalPages);

  return items;
};
