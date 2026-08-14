/** ISO-строка → «2026-08-14» для <input type="date">. */
export const toDateInputValue = (reviewDate: string) => {
  const date = new Date(reviewDate)

  if (Number.isNaN(date.getTime())) return ''

  const offset = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}
