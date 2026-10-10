import type { FaqItemDto } from '../model/types';

export const getFaqs = async () => {
  const response = await fetch('/api/faq');
  if (!response.ok) {
    throw new Error(`Failed to get FAQ (${response.statusText})`);
  }
  return (await response.json()) as FaqItemDto[];
};
