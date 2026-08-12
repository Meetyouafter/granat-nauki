/** ISO-строка → «12 августа 2026». */
export const formatReviewDate = (reviewDate: string) =>
  new Date(reviewDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
