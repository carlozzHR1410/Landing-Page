import CalendarGrid from '../components/CalendarGrid'
import { useStore } from '../store/useStore'
import { formatLongDate, getMonthLabel, sortAppointments, toMonthKey } from '../utils/date'

const shiftMonth = (monthKey, offset) => {
  const base = new Date(`${monthKey}-01T00:00:00`)
  base.setMonth(base.getMonth() + offset)
  return toMonthKey(base)
}

function MapPage() {
  const appointments = useStore((state) => state.appointments)
  const services = useStore((state) => state.services)
  const branches = useStore((state) => state.branches)
  const timeSlots = useStore((state) => state.timeSlots)
  const selectedDate = useStore((state) => state.selectedDate)
  const selectedMonth = useStore((state) => state.selectedMonth)
  const setSelectedDate = useStore((state) => state.setSelectedDate)
  const setSelectedMonth = useStore((state) => state.setSelectedMonth)

  const serviceMap = Object.fromEntries(services.map((service) => [service.id, service]))
  const branchMap = Object.fromEntries(branches.map((branch) => [branch.id, branch]))

  const countsByDate = appointments.reduce((accumulator, appointment) => {
    if (appointment.status === 'cancelada') return accumulator
    accumulator[appointment.date] = (accumulator[appointment.date] || 0) + 1
    return accumulator
  }, {})

  const dayAppointments = sortAppointments(
    appointments.filter((appointment) => appointment.date === selectedDate),
  )

  return (
    <section className="page agenda-layout">
      <div className="page-head">
        <p>Calendario interactivo con dias ocupados y disponibles.</p>
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

      <CalendarGrid
        monthKey={selectedMonth}
        selectedDate={selectedDate}
        countsByDate={countsByDate}
        onSelectDate={setSelectedDate}
      />

      <section className="agenda-panel">
        <h2>{formatLongDate(selectedDate)}</h2>

        <div className="day-slots">
          {timeSlots.map((slot) => {
            const appointment = dayAppointments.find(
              (item) => item.time === slot && item.status !== 'cancelada',
            )

            return (
              <div className={`slot-row ${appointment ? 'busy' : 'free'}`} key={slot}>
                <strong>{slot}</strong>
                <span>
                  {appointment
                    ? `${serviceMap[appointment.serviceId]?.name || 'Servicio'} - ${
                        appointment.clientName
                      }`
                    : 'Disponible'}
                </span>
                <small className="slot-status">
                  {appointment ? branchMap[appointment.branchId]?.name : 'Libre'}
                </small>
              </div>
            )
          })}
        </div>

        <div className="appointment-list">
          {dayAppointments.length === 0 ? (
            <div className="empty-state">
              <p>No hay citas registradas para este dia.</p>
            </div>
          ) : (
            dayAppointments.map((appointment) => (
              <article className="appointment-card" key={appointment.id}>
                <div className="appointment-meta">
                  <h3>{serviceMap[appointment.serviceId]?.name}</h3>
                  <span className={`status-pill status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
                <p>
                  {appointment.clientName} - {branchMap[appointment.branchId]?.name}
                </p>
                <small>{appointment.notes}</small>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  )
}

export default MapPage
