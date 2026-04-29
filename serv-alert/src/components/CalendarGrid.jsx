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
          const counts = countsByDate[dateKey] || { issue: 0, restore: 0 }
          const totalCount = counts.issue + counts.restore

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
              {totalCount > 0 && (
                <div className="calendar-day-counts">
                  {counts.issue > 0 && <small>F {counts.issue}</small>}
                  {counts.restore > 0 && <small>R {counts.restore}</small>}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarGrid
