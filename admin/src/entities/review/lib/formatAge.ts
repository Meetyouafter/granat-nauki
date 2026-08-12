/** 2.5 → «2,5 года», 1 → «1 год», 7 → «7 лет». */
export const formatAge = (age: number) => {
  const value = age.toLocaleString('ru-RU')

  if (!Number.isInteger(age)) return `${value} года`

  const lastTwo = age % 100
  const last = age % 10

  if (lastTwo >= 11 && lastTwo <= 14) return `${value} лет`
  if (last === 1) return `${value} год`
  if (last >= 2 && last <= 4) return `${value} года`

  return `${value} лет`
}
