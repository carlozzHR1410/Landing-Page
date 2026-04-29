import { useState } from 'react'
import CalendarGrid from '../components/CalendarGrid'
import { useReports } from '../context/ReportsContext'
import { formatLongDate, getMonthLabel, getTodayKey, toDateKey, toMonthKey } from '../utils/date'

const shiftMonth = (monthKey, offset) => {
  const base = new Date(`${monthKey}-01T00:00:00`)
  base.setMonth(base.getMonth() + offset)
  return toMonthKey(base)
}

function CalendarPage() {
  const { reports } = useReports()
  const todayKey = getTodayKey()
  const [selectedMonth, setSelectedMonth] = useState(toMonthKey(todayKey))
  const [selectedDate, setSelectedDate] = useState(todayKey)

  const countsByDate = reports.reduce((accumulator, report) => {
    const dateKey = toDateKey(new Date(report.createdAt))

    if (!accumulator[dateKey]) {
      accumulator[dateKey] = { issue: 0, restore: 0 }
    }

    if (report.reportType === 'restore') {
      accumulator[dateKey].restore += 1
    } else {
      accumulator[dateKey].issue += 1
    }

    return accumulator
  }, {})

  const dayReports = reports.filter((report) => toDateKey(new Date(report.createdAt)) === selectedDate)
  const issueReports = dayReports.filter((report) => report.reportType === 'issue')
  const restoreReports = dayReports.filter((report) => report.reportType === 'restore')

  return (
    <section className="page agenda-layout">
      <div className="page-head">
        <h1>Calendario de actividad</h1>
        <p>Revisa por fecha cuantas fallas se reportaron y cuantos servicios se restablecieron.</p>
        <div className="month-switcher">
          <button type="button" onClick={() => setSelectedMonth(shiftMonth(selectedMonth, -1))}>
            Anterior
          </button>
          <strong>{getMonthLabel(selectedMonth)}</strong>
          <button type="button" onClick={() => setSelectedMonth(shiftMonth(selectedMonth, 1))}>
            Siguiente
          </button>
        </div>
      </div>

      <div className="calendar-legend">
        <span>
          <strong>F</strong> Fallas reportadas
        </span>
        <span>
          <strong>R</strong> Restablecimientos
        </span>
      </div>

      <CalendarGrid
        monthKey={selectedMonth}
        selectedDate={selectedDate}
        countsByDate={countsByDate}
        onSelectDate={setSelectedDate}
      />

      <section className="agenda-panel report-calendar-panel">
        <h2>{formatLongDate(selectedDate)}</h2>

        <div className="summary-grid reports-summary-grid reports-summary-grid-compact">
          <article className="summary-card">
            <strong>{issueReports.length}</strong>
            <span>Fallas reportadas</span>
          </article>
          <article className="summary-card">
            <strong>{restoreReports.length}</strong>
            <span>Restablecimientos</span>
          </article>
          <article className="summary-card">
            <strong>{dayReports.length}</strong>
            <span>Movimientos del dia</span>
          </article>
        </div>

        <div className="calendar-day-panels">
          <div className="calendar-day-panel">
            <div className="calendar-day-panel-head">
              <h3>Reportados</h3>
              <span>{issueReports.length}</span>
            </div>

            {issueReports.length === 0 ? (
              <div className="empty-state">
                <p>No se registraron fallas este dia.</p>
              </div>
            ) : (
              issueReports.map((report) => (
                <article className="appointment-card report-day-card" key={report.id}>
                  <div className="appointment-meta">
                    <h3>{report.service}</h3>
                  </div>
                  <p>
                    {report.district}, {report.department}
                  </p>
                  <small>{new Date(report.createdAt).toLocaleTimeString('es-SV')}</small>
                  <small>{report.description}</small>
                </article>
              ))
            )}
          </div>

          <div className="calendar-day-panel">
            <div className="calendar-day-panel-head">
              <h3>Restablecidos</h3>
              <span>{restoreReports.length}</span>
            </div>

            {restoreReports.length === 0 ? (
              <div className="empty-state">
                <p>No hubo restablecimientos registrados este dia.</p>
              </div>
            ) : (
              restoreReports.map((report) => (
                <article className="appointment-card report-day-card" key={report.id}>
                  <div className="appointment-meta">
                    <h3>{report.service}</h3>
                    <span className="status-pill status-restored">Restablecido</span>
                  </div>
                  <p>
                    {report.district}, {report.department}
                  </p>
                  <small>{new Date(report.createdAt).toLocaleTimeString('es-SV')}</small>
                  <small>{report.description}</small>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </section>
  )
}

export default CalendarPage
