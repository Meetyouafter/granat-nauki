export interface SaveFaqItem {
  title: string;
  description: string;
  id?: number;
}

export const saveFaqs = async (items: SaveFaqItem[]) => {
  const response = await fetch('/api/faq', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) {
    throw new Error(`Failed to save FAQ (${response.statusText})`);
  }
  return (await response.json()) as unknown;
};
