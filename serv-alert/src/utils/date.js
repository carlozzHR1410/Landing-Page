const pad = (value) => String(value).padStart(2, '0')

export const toDateKey = (value) => {
  const date =
    value instanceof Date ? new Date(value.getTime()) : new Date(`${value || ''}T00:00:00`)

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const toMonthKey = (value) => toDateKey(value).slice(0, 7)

export const getTodayKey = () => toDateKey(new Date())

export const formatLongDate = (value) =>
  new Intl.DateTimeFormat('es-SV', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))

export const formatShortDate = (value) =>
  new Intl.DateTimeFormat('es-SV', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))

export const formatDateTime = (date, time) =>
  `${formatShortDate(date)} - ${time}`

export const getMonthLabel = (monthKey) =>
  new Intl.DateTimeFormat('es-SV', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${monthKey}-01T00:00:00`))

export const buildMonthGrid = (monthKey) => {
  const start = new Date(`${monthKey}-01T00:00:00`)
  const offset = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - offset)

  const days = []

  for (let index = 0; index < 42; index += 1) {
    const current = new Date(start.getTime())
    current.setDate(start.getDate() + index)
    days.push(toDateKey(current))
  }

  return days
}

export const isSameMonth = (dateKey, monthKey) => dateKey.startsWith(monthKey)

export const sortAppointments = (appointments) =>
  [...appointments].sort((left, right) =>
    `${left.date}T${left.time}`.localeCompare(`${right.date}T${right.time}`),
  )
