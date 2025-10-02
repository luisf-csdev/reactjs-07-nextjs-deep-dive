export function getWeekDays() {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
  })

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const weekDay = formatter.format(new Date(Date.UTC(2021, 5, i)))
    return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
  })

  return weekDays
}
