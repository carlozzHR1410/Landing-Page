import { buildMonthGrid, isSameMonth } from '../utils/date'

const weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

function CalendarGrid({ monthKey, selectedDate, countsByDate, onSelectDate }) {
  const days = buildMonthGrid(monthKey)

  return (
    <div className="calendar-card">
      <div className="calendar-weekdays">
        {weekDays.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((dateKey) => {
          const isSelected = dateKey === selectedDate
          const count = countsByDate[dateKey] || 0

          return (
            <button
              key={dateKey}
              type="button"
              className={`calendar-day ${isSameMonth(dateKey, monthKey) ? '' : 'outside'} ${
                isSelected ? 'selected' : ''
              }`}
              onClick={() => onSelectDate(dateKey)}
            >
              <span>{dateKey.slice(-2)}</span>
              {count > 0 && <small>{count}</small>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarGrid
